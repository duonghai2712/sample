import {getModel, dbConn} from "../../libs/dbConnect";
import mongoose, { Schema } from 'mongoose';
import {Authentication} from "./type";

export const tokenModel = getModel<Authentication.TokenT>("Tokens", dbConn, {
    type: { type: String },
    expiredDate :{ type: Date },
    token: { type: String },
    sessionId: { type: String },
    payload: { type: mongoose.Schema.Types.Mixed },
    _status: { type: Number, default: 1 }, //1 : active, 0 :deleted
    userId: { type: Schema.Types.ObjectId },
}, { timestamps: true, indexFields: ["type", "userId", "expiredDate", "sessionId", "token", "_status"], expireAfterSeconds: 60*60*24*30 });
