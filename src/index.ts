import { AuthModule } from "./modules/Authentication/module";
import { UserModule } from "./modules/User/module";
import {healthCheckModule} from "./modules/HealthCheck/module";
import {startHttpServer} from "./httpServer";
import {getConfig} from "./libs/getConfig";
import {seeding} from "./seeding";

export async function runServerFull() {
    const server = await startHttpServer({
        appModules: [
            AuthModule,
            UserModule,
            healthCheckModule
        ],
    });

    server.listen(getConfig("APP_PORT"));
    console.log(`App run on ${getConfig("APP_PORT")}`);

    // await seeding();
    return server;
}

runServerFull().then(r => console.log("Start OK"));