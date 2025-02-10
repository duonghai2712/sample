export type MyErrorT<T1 = any> = {
    message: string;
    status: number;
    code:
        | 'ServerNotAllow'
        | 'NotValidate'
        | 'NotFound'
        | 'NotAuthentication'
        | 'PermissionDenied'
        | 'ServerError'
        | 'MissingParameters'
        | 'ServiceUnavailable'
        | 'TimeoutError'
    data: T1;
    error: any;
};
export const MyError = {
    serverNotAllow(message: string, params: any = {}) {
        const { error = null, data = null } = params;
        return {
            message,
            status: 406,
            code: 'ServerNotAllow',
            data,
            error,
        };
    },
    NotValidate(message: string, params: any = {}) {
        const { error = null, data = null } = params;
        return {
            message,
            status: 400,
            code: 'NotValidate',
            data,
            error,
        };
    },
    MissingParameters(message: string, params: any = {}) {
        const { error = null, data = null } = params;
        return {
            message,
            status: 422,
            code: 'MissingParameters',
            data,
            error,
        };
    },
    NotFound(message: string, params: any = {}) {
        const { error = null, data = null } = params;
        return {
            message,
            status: 404,
            code: 'NotFound',
            data,
            error,
        };
    },
    NotAuthentication(message: string, params: any = {}) {
        const { error = null, data = null } = params;
        return {
            message,
            status: 401,
            code: 'NotAuthentication',
            data,
            error,
        };
    },
    PermissionDenied(message: string, params: any = {}) {
        const { error = null, data = null } = params;
        return {
            message,
            status: 403,
            code: 'PermissionDenied',
            data,
            error,
        };
    },
    ServerError(message: string, params: any = {}) {
        const { error = null, data = null } = params;
        return {
            message,
            status: 500,
            code: 'ServerError',
            data,
            error,
        };
    },
    ServiceUnavailable(message: string, params: any = {}) {
        const { error = null, data = null } = params;
        return {
            message,
            status: 503,
            code: 'ServiceUnavailable',
            data,
            error,
        };
    },
    TimeoutError(message: string, params: any = {}) {
        const { error = null, data = null } = params;
        const _error = new Error(message);
        return {
            message,
            status: 500,
            code: 'TimeoutError',
            data,
            error,
        };
    },
};
