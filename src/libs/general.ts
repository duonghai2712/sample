import 'multer';
import cors from '@koa/cors';
import { MyError } from './myError';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import KoaQueryString from 'koa-qs';
import { z } from 'zod';

const domain = require('domain');

export const middlewareBodyParser = (options = { enableTypes: ['json', 'text', 'form', 'xml'] }) => {
    return bodyParser(options);
};

export const middlewareCors = () => {
    return cors();
};

export const middlewareHandleError = (options = {}): Koa.Middleware => {
    return async (ctx: Koa.Context, next) => {
        try {
            await next();
            if (!ctx.status || ctx.status === 404) {
                ctx.status = 404;
                ctx.body = { message: 'Server Res: 404 Not found' };
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                const zodMessage = err.issues
                    .map((issue) => {
                        if (issue.path.length === 0) {
                            return issue.message;
                        }
                        const field = issue.path.join('.');
                        const errorMessage = issue.message;
                        return `${field} ${errorMessage}`;
                    })
                    .join(', ');
                ctx.status = 400;
                ctx.body = MyError.NotValidate(zodMessage, { error: err });
            } else {
                ctx.status = err.status || 500;
                ctx.body = {
                    code: err.code || err.status,
                    status: err.status,
                    message: err.message,
                    data: err.data,
                    error: err.error,
                };
                if (
                    process.env.NODE_ENV === 'test' ||
                    process.env.NODE_ENV === 'dev'
                ) {
                    console.error(err);
                    // ctx.app.emit('error', err, ctx);
                } else if (process.env.NODE_ENV === 'production') {
                    console.error(err);
                } else {
                    console.error(err);
                }
            }
        }
    };
};

export const middlewareSetResponseHeader = (option = {}): Koa.Middleware => {
    return async (ctx: Koa.Context, next: Koa.Next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        ctx.set('X-Response-Time', `${ms}ms`);
    };
};

export const middlewareQueryString = (app: Koa) => {
    KoaQueryString(app, 'extended');
};
