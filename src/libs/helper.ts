import * as crypto from 'crypto';
import * as jsonwebtoken from 'jsonwebtoken';
import mongoose from 'mongoose';
import { v1 as getUuid } from 'uuid';
import { getConfig } from './getConfig';

export const helper = {
    getMongoId(id: string) {
        // @ts-ignore
        return new mongoose.Types.ObjectId(
            id
        ) as mongoose.Schema.Types.ObjectId;
    },
    isMongoId(id: string): boolean {
        // @ts-ignore
        return mongoose.Types.ObjectId.isValid(id);
    },
    getNewUuid() {
        return getUuid();
    },
    genMd5(text: string): string {
        return crypto.createHash('md5').update(text).digest('hex');
    },
    isArray(array: any) {
        return !!array && array.constructor === Array;
    },
    isObject(object: any) {
        return !!object && object.constructor === Object;
    },
    changeToSlug(str: string, replacer = '-') {
        // Chuyển hết sang chữ thường
        str = str.toLowerCase();

        // xóa dấu
        str = str.replace(/([àáạảãâầấậẩẫăằắặẳẵ])/g, 'a');
        str = str.replace(/([èéẹẻẽêềếệểễ])/g, 'e');
        str = str.replace(/([ìíịỉĩ])/g, 'i');
        str = str.replace(/([òóọỏõôồốộổỗơờớợởỡ])/g, 'o');
        str = str.replace(/([ùúụủũưừứựửữ])/g, 'u');
        str = str.replace(/([ỳýỵỷỹ])/g, 'y');
        str = str.replace(/(đ)/g, 'd');

        // Xóa ký tự đặc biệt
        str = str.replace(/([^0-9a-z-\s])/g, '');

        // Xóa khoảng trắng thay bằng ký tự -
        str = str.replace(/(\s+)/g, replacer);

        // xóa phần dự - ở đầu
        str = str.replace(/^-+/g, '');

        // xóa phần dư - ở cuối
        str = str.replace(/-+$/g, '');

        // return
        return str;
    },
    verifyAccessToken(accessToken: string, secret = getConfig('SECRET')) {
        let decode: any;
        try {
            decode = jsonwebtoken.verify(accessToken, secret);
            if (decode?.type !== 'access_token') {
                decode = false;
            }
        } catch (err) {
            // console.log(err);
            decode = false;
        }
        return decode;
    },
    verifyRefreshToken(token: string, secret = getConfig('SECRET')): any {
        let decode: any;
        try {
            decode = jsonwebtoken.verify(token, secret);
            if (decode?.type !== 'refresh_token') {
                decode = false;
            }
        } catch (error) {
            // console.log(err);
            decode = false;
        }
        return decode;
    },
    createAccessToken(payload: Record<string, any>, exp = getConfig('ACCESS_TOKEN_LIFE_TIME'), secret = getConfig('SECRET')) {
        const expireValue = Math.floor(Date.now() / 1000) + Number(exp);
        const expiredDate = new Date(expireValue * 1000);
        return {
            token: jsonwebtoken.sign(
                {
                    ...payload,
                    iat: Math.floor(Date.now() / 1000) + Number(exp),
                    exp: Math.floor(Date.now() / 1000) + Number(exp),
                },
                secret
            ),
            exp: expiredDate,
            payload,
        };
    },
    createRefreshToken(payload: Record<string, any>, exp = getConfig('REFRESH_TOKEN_LIFE_TIME'), secret = getConfig('SECRET')) {
        const expireValue = Math.floor(Date.now() / 1000) + Number(exp);
        const expiredDate = new Date(expireValue * 1000);
        return {
            token: jsonwebtoken.sign(
                {
                    ...payload,
                    exp: Math.floor(Date.now() / 1000) + Number(exp), // 60 seconds * 60 minutes = 1 hour
                },
                secret
            ),
            exp: expiredDate
        };
    }
};
