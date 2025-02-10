import {LANGUAGES, ROLES, STATUS} from '../../const';
import {getModel, dbConn} from "../../libs/dbConnect";
import {User} from "./type";


export const userModel = getModel<User.UserT>("Users", dbConn, {
    fullname: { type: String },
    slug: { type: String },
    password: { type: String },
    phone: { type: String },
    email: { type: String },
    role: { type: String, default: ROLES.MEMBER },
    bio: { type: String },
    language: { type: String, default: LANGUAGES.ENGLISH },
    status: { type: String, default: STATUS.ACTIVE },
}, { timestamps: true, indexFields: ["fullname", "slug", "status", "role", "language", "email", "bio", "phone", "status"], searchFields: ["fullname", "bio"] });
