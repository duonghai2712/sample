import { ObjectId } from "mongoose";
import {
    T__RequestCreate,
    T__RequestList,
    T__Response,
    T__ResponseList,
    T__RequestUpdate,
    T__RequestGetById,
    T__RequestDelete
} from '../../libs/typeReq';

declare namespace User {
    type UserT = {
        id?: ObjectId;
        fullname: string;
        slug: string;
        username: string;
        password: string;
        role: string;
        phone?: string;
        email?: string
        bio?: string;
        language: string;
        status?: string;
    };

    type serviceType = {
        list(params: T__RequestList): Promise<T__ResponseList<UserT | Record<string, any>>>;
        create(params: T__RequestCreate<UserT | Record<string, any>>): Promise<T__Response<UserT | Record<string, any>>>;
        update(params: T__RequestUpdate<UserT | Record<string, any>>): Promise<T__Response<UserT | Record<string, any>>>;
        getById(params: T__RequestGetById): Promise<T__Response<UserT | Record<string, any>>>;
        delete(params: T__RequestDelete): Promise<T__Response<UserT | Record<string, any>>>;
    };
}
