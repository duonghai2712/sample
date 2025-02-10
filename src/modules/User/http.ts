import Koa from "koa";
import Router from "@koa/router";
import { validates } from "./validate";
import { userService } from "./service";
import {apiSuccessHandler} from "../../libs/apiHelper";
import {middlewareAdmin, middlewareAuthGuard} from "../Authentication/middleware";


export const httpController = new Koa();
const router = new Router();

router.post("", middlewareAdmin(), async (ctx, next) => {
    const { user } = ctx;
    // @ts-ignore
    const record = validates.CreateUser.parse(ctx.request.body.record);
    const result = await userService.create({ record, user });
    apiSuccessHandler.sendJson(ctx, "Tạo mới người dùng thành công", result);
    await next();
});

router.get("", middlewareAdmin(), async (ctx, next) => {
    const { user } = ctx;
    const result = await userService.list({ ...ctx.request.query, user });
    apiSuccessHandler.sendJson(ctx, "Lấy danh sách người dùng thành công", result);
    await next();
});

router.get("/:id([a-f0-9]{24})", async (ctx, next) => {
    const { user } = ctx;
    const { id } = ctx.params;
    const result = await userService.getById({ id, user });
    apiSuccessHandler.sendJson(ctx, "Lấy thông tin người dùng thành công", result);
    await next();
});

router.patch("/:id([a-f0-9]{24})", async (ctx, next) => {
    const { user } = ctx;
    const { id } = ctx.params;
    // @ts-ignore
    const record = validates.UpdateUser.parse(ctx.request.body.record);
    const result = await userService.update({ id, record, user });
    apiSuccessHandler.sendJson(ctx, "Cập nhật người dùng thành công", result);
    await next();
});

router.delete("/:id([a-f0-9]{24})", middlewareAdmin(), async (ctx, next) => {
    const { user } = ctx;
    const { id } = ctx.params;
    const result = await userService.delete({ id, user });
    apiSuccessHandler.sendJson(ctx, "Xóa người dùng thành công", result);
    await next();
});

httpController.use(middlewareAuthGuard()).use(router.routes()).use(router.allowedMethods());
