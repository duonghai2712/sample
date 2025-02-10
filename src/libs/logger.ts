import pino from "pino";
import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import { getConfig } from "./getConfig";

const dirLogs = path.join(process.cwd(), "./tmp/logs");
fs.mkdirSync(dirLogs, { recursive: true });
var pretty = require("pino-pretty");

const _logger = pino.multistream([
    { stream: pretty() },
    {
        stream: fs.createWriteStream(
            path.join(dirLogs, "info.log"),
            { flags: "a" }
        )
    },
    {
        level: "error",
        stream: fs.createWriteStream(
            path.join(dirLogs, "error.log"),
            { flags: "a" }
        )
    }
]);
export const loggerPipe = _logger;
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const logger = require("pino")(
    {
        dedupe: true

    },
    _logger
);
logger.level = getConfig("logger.level", "info");
