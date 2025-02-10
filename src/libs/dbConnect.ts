import mongoose, { SchemaDefinition } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { getConfig } from './getConfig';

const options = {
    useNewUrlParser: true,
    connectTimeoutMS: 5000,
    useUnifiedTopology: true,
};

const url = getConfig('MONGO_URI');
export const dbConn = mongoose.createConnection(url, options);
const label = 'Mongo connect';
let isDone = false;
console.time(label);
dbConn.on('error', (err) => {
    console.error('DB cant connect', url, err);
    if (!isDone) {
        console.timeEnd(label);
        isDone = true;
    }
});
dbConn.on('connected', () => {
    if (!isDone) {
        console.timeLog(label, `${dbConn.host}:${dbConn.name}`);
        console.timeEnd(label);
        isDone = true;
    }
});

export function getModel<T1 = any>(
    name: string,
    dbCon: mongoose.Connection,
    fieldSchema: SchemaDefinition<T1>,
    params?: {
        timestamps?: boolean;
        searchFields?: string[];
        indexFields?: string[];
        expireAfterSeconds?: number;
        strict?: boolean;
        schemaCallback?: (schema: mongoose.Schema<T1>) => void;
    }
) {
    // @ts-ignore
    params = params || {};
    const {
        timestamps = false,
        indexFields = [],
        searchFields = [],
        strict = true,
    } = params;
    const simpleSchema = new mongoose.Schema<T1>(
        {
            ...fieldSchema,
            createdById: { type: String },
            createdBy: {
                type: {
                    id: String,
                    name: String,
                    email: String,
                },
            },
            updatedById: { type: String },
            updatedBy: {
                type: {
                    id: String,
                    name: String,
                    email: String,
                },
            },
        },
        {
            timestamps: timestamps ? timestamps : false,
            strict: strict,
            toJSON: {
                transform: function (doc, ret) {
                    ret.id = ret._id;
                    delete ret.password;
                    delete ret._id;
                    delete ret.__v;
                },
            },
        }
    );
    simpleSchema.plugin(mongoosePaginate);
    if (searchFields.length) {
        const fullTextSearchFields = searchFields.map((field: string) => ({ [field]: 'text' })).reduce((a, b) => ({ ...a, ...b }), {});
        //@ts-ignore
        simpleSchema.index(fullTextSearchFields, { default_language: "en" });
    }
    if (indexFields.length)
        indexFields.forEach((field: string) => {
            simpleSchema.index({ [field]: 1 });
        });
    if (params.expireAfterSeconds)
        simpleSchema.index(
            { createdAt: 1 },
            { expireAfterSeconds: params.expireAfterSeconds }
        );
    if (typeof params?.schemaCallback === 'function') {
        params?.schemaCallback(simpleSchema);
    }
    return dbCon.model(name, simpleSchema, name);
}