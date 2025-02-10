import { STATUS } from '../../const';
import {MyError} from "../../libs/myError";
import {helper} from "../../libs/helper";
import {getQuickCrud} from "../../libs/coreRestful";
import {Authentication} from "./type";
import {userModel} from "../User/model";
import {tokenModel} from "./model";
import {getConfig} from "../../libs/getConfig";
import {dbConn} from "../../libs/dbConnect";
import {User} from "../User/type";

const quickHandler = getQuickCrud<User.UserT>({ Model: userModel });

export const authService: Authentication.serviceType = {
    async getTokens(params){
        const { user } = params;
        const uid = helper.getNewUuid();
        const payload = { userId: String(user.id), name: user.name, sessionId: uid, email: user.email, phone: user.phone, role: user.role };
        const access = helper.createAccessToken({ ...payload, type: "access_token" });
        const refresh = helper.createRefreshToken({ ...payload, type: "refresh_token" });

        await tokenModel.create({payload, type: "access_token", token: access.token, sessionId: uid, userId: user.id, expiredDate: access.exp});
        await tokenModel.create({payload, type: "refresh_token", token: refresh.token, sessionId: uid, userId: user.id, expiredDate: refresh.exp});
        // @ts-ignore
        return { user, tokens: { access: access, refresh: refresh } };
    },
    async login(params){
        const { username, password } = params;

        const user = await userModel.findOne({ $or: [ { phone: username }, { email: username } ]});
        if (!user || user.password !== helper.genMd5(password)) throw MyError.NotAuthentication("Tài khoản hoặc mật khẩu không chính xác");
        if(user.status !== STATUS.ACTIVE) throw MyError.NotAuthentication("Tài khoản đã bị vô hiệu hóa");
        return authService.getTokens({ user: user.toJSON() });
    },
    async getUserInfo(params){
        const { user } = params;
        return await quickHandler.getById({ id: String(user.id) });
    },
    async refreshToken(params){
        const { refreshToken } = params;
        const exp = getConfig('REFRESH_TOKEN_LIFE_TIME');
        const token = await tokenModel.findOne({token: refreshToken, _status: 1, type: "refresh_token", expiredDate: { $gte: new Date(Date.now() - exp * 1000) },});
        if (!token) throw MyError.NotAuthentication("Phiên đăng nhập đã hết hạn, xin vui lòng đăng nhập lại!");

        const decode = helper.verifyRefreshToken(refreshToken);
        if (!decode) throw MyError.NotAuthentication("Sai refreshToken");

        const user  = await userModel.findById(helper.getMongoId(decode.userId));

        await tokenModel.updateMany({ sessionId: token.sessionId, userId: user._id, _status: 1 }, { _status: -1 });
        return authService.getTokens({ user: user.toJSON() });
    },
    async logout(params){
        const { user } = params;
        await tokenModel.updateMany({ sessionId: user.sessionId, userId: user.id, _status: 1 }, { _status: -1 });
        return true;
    },
    async changePassword(params){
        const { oldPassword, newPassword, user } = params;
        if(!user || !user.id) throw MyError.NotAuthentication("Bạn chưa đăng nhập");
        const recordInDb = await userModel.findById(user.id);
        if(!recordInDb) throw MyError.NotFound("Không tìm thấy người dùng");
        if(recordInDb.password !== helper.genMd5(oldPassword)) throw MyError.NotValidate("Mật khẩu cũ không chính xác");
        const session = await dbConn.startSession();
        try {
            session.startTransaction();
            const result = await quickHandler.update({ id: String(user.id), record: { password: helper.genMd5(newPassword) }, user, session });
            await tokenModel.updateMany({userId: user.id, _status: 1}, { _status: -1 });
            await session.commitTransaction();
            return result;
        } catch (e) {
            await session.abortTransaction();
            console.log(e);
            throw MyError.ServiceUnavailable("Cập nhật tài khoản thất bại");
        } finally {
            await session.endSession();
        }
    }
};

