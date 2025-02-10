import Koa from "koa";
import Router from "@koa/router";
import { validates } from "./validate";
import { authService } from "./service";
import {apiSuccessHandler} from "../../libs/apiHelper";
import {middlewareAuthGuard} from "./middleware";
import {userService} from "../User/service";

export const httpController = new Koa();
const router = new Router();

router.post("/login", async (ctx, next) => {
    //@ts-ignore
    const { username, password } = validates.login.parse(ctx.request.body);
    const result = await authService.login({ username, password });
    apiSuccessHandler.sendJson(ctx, "Đăng nhập thành công", { ...result });
    await next();
});

router.get("/user-info", middlewareAuthGuard(), async (ctx, next) => {
    const { user } = ctx;
    const result = await authService.getUserInfo({ user });
    apiSuccessHandler.sendJson(ctx, "Lấy thông tin người dùng thành công", result);
    await next();
});

router.post("/register", async (ctx, next) => {
    // @ts-ignore
    const record = validates.registerUser.parse(ctx.request.body.record);
    const result = await userService.create({ record });
    apiSuccessHandler.sendJson(ctx, "Đăng kí tài khoản thành công", result);
    await next();
});

router.patch("/change-password", middlewareAuthGuard(), async (ctx, next) => {
    const { user } = ctx;
    // @ts-ignore
    const { oldPassword, newPassword } = validates.ChangePassword.parse(ctx.request.body);
    const result = await authService.changePassword({ oldPassword, newPassword, user });
    apiSuccessHandler.sendJson(ctx, "Đổi mật khẩu thành công", result);
    await next();
});

router.post("/refresh-token", async (ctx, next) => {
        //@ts-ignore
        const { refreshToken } = validates.refreshToken.parse(ctx.request.body);
        const result = await authService.refreshToken({ refreshToken });
        apiSuccessHandler.sendJson(ctx, "Làm mới token thành công", result);
        await next();
    });

router.post("/logout", middlewareAuthGuard(), async (ctx, next) => {
        const { user } = ctx;
        await authService.logout({ user });
        apiSuccessHandler.sendJson(ctx, "Đăng xuất thành công", {});
        await next();
    });

httpController.use(router.routes()).use(router.allowedMethods());
