import Koa from 'koa';
import mount from 'koa-mount';
import http from 'http';
import { Server } from 'http';
import session from 'koa-session';
import {
    middlewareBodyParser,
    middlewareCors,
    middlewareHandleError,
    middlewareQueryString,
    middlewareSetResponseHeader
} from './libs/general';
import { getConfig } from './libs/getConfig';
import {logger} from "./libs/logger";
import R from 'ramda';

export const httpServer = new Koa();

httpServer.use(middlewareSetResponseHeader());
middlewareQueryString(httpServer);

httpServer.use(middlewareHandleError());
httpServer.use(middlewareBodyParser());
httpServer.use(middlewareCors());
httpServer.use(session({ signed: false }, httpServer));
let server: Server | null = null;

export async function startHttpServer(params: { port?: number; host?: string; appModules?: any[]; listen?: boolean; }) {
    const host = params.host || getConfig('APP_HOST');
    const port = params.host || getConfig('APP_PORT');
    let appModules = params.appModules || [];

    if (appModules.length) {
        //Lọc những appModule trùng và những module không có router hoặc http controller
        appModules = R.uniqBy((appModule) => appModule.route, appModules).filter((appModule) => appModule.route && appModule.httpController);
        // truyền vào các module muốn chạy

        //Module ignore đăng nhập
        appModules.forEach((appModules: | { [keys: string]: any } | { route?: string; httpController?: any; name?: string; }) => {
                logger.info(`http route: ${appModules.route}`);
                httpServer.use(mount(appModules.route, appModules.httpController));
            }
        );
    } else {
        logger.error('No http route to init');
    }

    if (!server) {
        server = http.createServer(httpServer.callback());
    }

    const address = `${host}:${port}`;
    if (params.listen) {
        logger.info(JSON.stringify({ server: 'http', address, host, port }));
        server.listen(getConfig('APP_PORT'));
    }
    return server;
}

export async function closeHttpServer(_server: Server | null = server) {
    if (_server) {
        _server.close();
    } else {
        if (server) {
            server.close();
        }
        server = null;
    }
}
