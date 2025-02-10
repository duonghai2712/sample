import {getQuickCrud} from "../../libs/coreRestful";
import {User} from "./type";
import {userModel} from "./model";
import {helper} from "../../libs/helper";
import {MyError} from "../../libs/myError";

const quickHandler = getQuickCrud<User.UserT>({ Model: userModel });

export const userService: User.serviceType = {
    list: quickHandler.list,
    getById: quickHandler.getById,
    delete: quickHandler.delete,
    async create(params) {
        const { record } = params;
        const isExistsPhone = await userModel.exists({ phone: record.phone });
        if(isExistsPhone) throw MyError.NotValidate("Số điện thoại đã tồn tại");

        const isExistsEmail = await userModel.exists({ email: record.email });
        if(isExistsEmail) throw MyError.NotValidate("Email đã tồn tại");
        return await quickHandler.create({ ...params, record: { ...record, password: helper.genMd5(record.password), slug: helper.changeToSlug(record.fullname) } });
    },
    async update(params) {
        const { id, record } = params;
        if(record.password) record.password = helper.genMd5(record.password);
        if(record.fullname) record.slug = helper.changeToSlug(record.fullname);

        if(record.phone){
            const isExistsPhone = await userModel.exists({ _id: { $ne: helper.getMongoId(id) }, phone: record.phone });
            if(isExistsPhone) throw MyError.NotValidate("Số điện thoại đã tồn tại");
        }

        if(record.email){
            const isExistsEmail = await userModel.exists({ _id: { $ne: helper.getMongoId(id) }, email: record.email });
            if(isExistsEmail) throw MyError.NotValidate("Email đã tồn tại");
        }
        return await quickHandler.update({ ...params, record });
    },
};
