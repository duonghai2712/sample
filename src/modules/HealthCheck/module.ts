import {httpController} from "./http";

export const healthCheckModule = {
    httpController,
    route: '/api/v1/health',
    name: 'healthCheckModule',
};