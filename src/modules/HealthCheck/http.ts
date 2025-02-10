import Koa from 'koa';
import Router from '@koa/router';
import {apiSuccessHandler} from "../../libs/apiHelper";

export const httpController = new Koa();
const router = new Router();

router.all('', ...[
        async function (ctx: Koa.Context, next: Koa.Next) {
            apiSuccessHandler.sendJson(ctx, 'Server OK', {
                date: new Date(),
            });
            await next();
        },
    ]
);
httpController.use(router.routes()).use(router.allowedMethods());