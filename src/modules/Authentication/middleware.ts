import Koa from 'koa';
import {helper} from "../../libs/helper";
import {userModel} from "../User/model";
import {tokenModel} from "./model";
import {MyError} from "../../libs/myError";
import {getConfig} from "../../libs/getConfig";
import {ROLES} from "../../const";

export const middlewareAuthGuard = (option = {}): Koa.Middleware => {
    return async (ctx: Koa.Context, next: Koa.Next) => {
        let accessTokenHeader = ctx.session.accessToken;
        const authHeader = String(ctx.request.headers["authorization"] || "");
        if (authHeader.startsWith("Bearer ")) {
            accessTokenHeader = authHeader.substring(7, authHeader.length);
        }

        const decode: any = await helper.verifyAccessToken(accessTokenHeader);
        if (!decode) throw MyError.NotAuthentication("Không xác định được người dùng");

        const sessionId = decode.sessionId;
        const recordInDb = await userModel.findOne({ _id: helper.getMongoId(decode.userId) }).select({ name: 1, phone: 1, email: 1, status: 1, role: 1, language: 1 });
        if (!recordInDb) throw MyError.NotAuthentication("Không xác định được người dùng");

        const user = recordInDb.toJSON();
        const exp = getConfig("ACCESS_TOKEN_LIFE_TIME");
        const tokenExists = await tokenModel.exists({type: "access_token", token: accessTokenHeader, expiredDate: { $gte: new Date(Date.now() - exp * 1000) }, userId: user.id, _status: 1});
        if (!tokenExists) throw MyError.NotAuthentication("Không xác định được người dùng");
        ctx.user = { ...user, sessionId };
        await next();
    };
};

export const middlewareAdmin = (option = {}): Koa.Middleware => {
    return async (ctx: Koa.Context, next: Koa.Next) => {
        const user = ctx.user;
        if (!user || !user.role || user.role !== ROLES.ADMIN) {
            throw MyError.PermissionDenied("Bạn không có quyền");
        }

        await next();
    };
};

