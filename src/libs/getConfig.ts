import "js-yaml";
import path from "path";
import config = require("config");

export function getConfig(key: string, defaultValue: any = null) {

    if (key === "PROJECT_PATH" && typeof process.env[key] === "undefined") {
        return path.join(__dirname, "../../");
    }
    if (typeof process.env[key] !== "undefined") {
        return process.env[key];
    }
    if(defaultValue !==null && !config.has(key)){
        return defaultValue
    }
    try {
        const value = config.get(key);
        if (typeof value === "undefined") {
            return defaultValue;
        }
        return value;
    } catch (err) {
        return defaultValue;
    }
}


