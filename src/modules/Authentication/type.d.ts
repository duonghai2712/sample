import { ObjectId } from "mongoose";
import { T__Response } from '../../libs/typeReq';
import {User} from "../User/type";

declare namespace Authentication {
    type TokenT = {
        id?: ObjectId;
        userId: ObjectId;
        type: string;
        expiredDate: Date;
        sessionId: string;
        token: string;
        payload: { type: mongoose.Schema.Types.Mixed },
        _status: number;
    };

    type serviceType = {
        login(params: { username: string, password: string }): Promise<{ user: any; tokens: { access: { token: string; expire?: string; payload?: any }; refresh: { token: string; expire?: Date }; }; }>;
        changePassword(params: { oldPassword: string, newPassword: string; user: any }): Promise<T__Response<UserT | Record<string, any>>>;
        getUserInfo(params: { user: any }): Promise<T__Response<any>>;
        refreshToken(params: { refreshToken: string }): Promise<{ user: any; tokens: { access: { token: string; expire?: string; payload?: any }; refresh: { token: string; expire?: Date }; }; }>;
        getTokens(params: { user: any }): Promise<{ user: any; tokens: { access: { token: string; expire?: string; payload?: any }; refresh: { token: string; expire?: Date }; }; }>;
        logout(params: { user: any }): Promise<boolean>;
    };
}
