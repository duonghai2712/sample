import mongoose, { ClientSession } from 'mongoose';
import * as R from 'ramda';
import { MyError } from './myError';
import { helper } from './helper';
import { apiHelper } from './apiHelper';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const is = require('is_js');
export const joinRecord = async (
    anyRecord:
        | Record<string, any>
        | Record<string, any>[]
        | { id: string }
        | { id: string }[],
    config: {
        type?: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_MANY';
        joinField?: string;
        dataField: string;

        //Các trường trong quan hệ ONE_TO_ONE và ONE_TO_MANY
        mappingField?: string;
        joinModel: any;
        select?: any;

        //Trường trong quan hệ MANY_TO_MANY
        linkings?: {
            joinField?: any;
            mappingField?: any;
            dataField: string;
            model?: any;
            select?: any;
        }[];
    }[]
) => {
    let items: any;
    if (is.array(anyRecord)) {
        items = anyRecord;
    }
    if (is.not.array(anyRecord) && is.object(anyRecord)) {
        items = [anyRecord];
    }

    ///inmediate Field
    if (config) {
        for (let i = 0; i < config.length; i++) {
            const {
                type = 'ONE_TO_ONE',
                joinField = 'id',
                mappingField = 'id',
                dataField,
                joinModel,
                select = { name: 1 },
                linkings = [],
            } = config[i];

            //Lấy tất cả dữ liệu để liên kết
            let allValue = R.uniq(
                R.flatten(
                    items.map((item: any) => {
                        if (is.string(item[joinField]) || joinField === 'id') return [item[joinField]];
                        if (is.array(item[joinField])) return item[joinField];
                        if (helper.isMongoId(item[joinField])) return [item[joinField]];
                        return [];
                    })
                )
            );

            //Móc lối để lấy dữ liệu liên kết
            if (allValue.length) {
                if (type === 'ONE_TO_ONE' || type === 'ONE_TO_MANY') {
                    let allRecord = await joinModel.find({ [mappingField === 'id' ? '_id' : mappingField]: { $in: allValue }, }).select(select);
                    allRecord = allRecord.map((record: any) => record.toJSON());

                    if (type === 'ONE_TO_ONE') allRecord = R.indexBy((item: any) => item[mappingField], allRecord);
                    if (type === 'ONE_TO_MANY') allRecord = R.groupBy((item: any) => item[mappingField], allRecord);

                    items = items.map((item: any) => {
                        if (helper.isArray(item[joinField])) return { ...item, [dataField]: item[joinField].map((val: string) => allRecord[val]) };
                        return { ...item, [dataField]: allRecord[item[joinField]] };
                    });
                }

                if (type === 'MANY_TO_MANY' && linkings.length) {
                    let allRecord = await joinModel.find({ [mappingField]: { $in: allValue } }).select(select);
                    allRecord = allRecord.map((record: any) => record.toJSON());
                    if(allRecord.length){
                        for(const linking of linkings){
                            const linkingJoinField = linking.joinField; // Trường trong bảng liên kết của model thứ hai
                            const linkingMappingField = linking.mappingField || 'id'; // Trường trong bảng liên kết của model thứ hai
                            const linkingDataField = linking.dataField;

                            const linkingModel = linking.model;
                            const linkingSelect = linking.select;
                            const allLinkingValue = allRecord.map((item: any) => item[linkingJoinField]).filter((item: any) => item);

                            if (allLinkingValue.length) {
                                let allLinkingRecord = await linkingModel.find({ [linkingMappingField === 'id' ? '_id' : linkingMappingField]: { $in: allLinkingValue, }, }).select(linkingSelect);
                                allLinkingRecord = allLinkingRecord.map((record: any) => record.toJSON());

                                allLinkingRecord = R.indexBy((item: any) => item[linkingMappingField], allLinkingRecord);
                                allRecord = allRecord.map((item: any) => {
                                    if(!item[linkingJoinField]) return item;
                                    return { ...item, [linkingDataField]: allLinkingRecord[item[linkingJoinField]] };
                                });
                            }
                        }

                        items = items.map((item: any) => ({ ...item, [dataField]: allRecord.filter((record: any) => String(record[mappingField]) === String(item[joinField])) }));
                    }
                }
            }
        }
    }
    if (is.array(anyRecord)) {
        return items;
    }
    if (is.not.array(anyRecord) && is.object(anyRecord)) {
        return items[0];
    }
};

/*
 * @desc : giúp tạo nhanh crud để xử lý, phục chủ yếu cho POC và chỉ work với mongoose. Trong trường logic nhiều recommend, bạn tự viết handler của mình
 * */
export namespace CrudQuick {
    export type crudBuild<T1> = {
        Model: mongoose.Model<T1> | { [key: string]: any };
        options?: {
            join?: {
                type?: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_MANY'; // ONE_TO_ONE trường dữ liệu lưu có thể lưu là array key liên kết
                joinField?: string;
                dataField: string;

                //Các trường trong quan hệ ONE_TO_ONE và ONE_TO_MANY
                //Nếu là quan hệ MANY_TO_MANY thì đây là bảng liên kết
                mappingField?: string;
                joinModel: any;
                select?: any;

                //Trường trong quan hệ MANY_TO_MANY
                linkings?: {
                    joinField?: any;
                    mappingField?: any;
                    dataField: string;
                    model?: any;
                    select?: any;
                }[];
            }[];
            mapRecord?: (record: Record<string, any>) => Promise<Record<string, any>> | null;
        };
    };

    export type listParams = {
        search?: string;
        filter?: Record<string, any>;
        filterCustom?: Record<string, any>;
        skip?: number;
        limit?: number | string;
        page?: number | string;
        select?: any;
        join?: any;
        sort?: { [key: string]: number };
        user?: any;
        language?: string;
        type?: string;
    };
    export type recordFind = {
        id: string;
        user?: any;
        filter?: Record<string, any>;
        filterCustom?: Record<string, any>;
        join?: any;
        select?: any;
    };
    export type recordCreate = {
        record: any;
        join?: any;
        session?: ClientSession,
        user?: any | { id: string };
    };
    export type recordUpdate = {
        id: string;
        filter?: Record<string, any>;
        filterCustom?: Record<string, any>;
        session?: ClientSession,
        record: any;
        select?: any;
        user?: any;
        join?: any;
    };
    export type recordDelete = {
        id: string;
        filter?: Record<string, any>;
        filterCustom?: Record<string, any>;
        session?: ClientSession,
        user?: any;
        select?: any;
        join?: any;
    };

    export type listOut<T1> = Promise<{
        search?: string;
        items: T1[] | Record<string, any>[];
        limit: number;
        page: number;
        sort?: { [key: string]: number };
        total: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        totalPages: number;
        filter?: Record<string, any>;
        filterCustom?: Record<string, any>;
    }>;
    export type allOut<T1> = Promise<{
        items: T1[] | Record<string, any>[];
        filter: Record<string, any>;
    }>;
    export type recordRes<T1> = Promise<{ record: T1 | Record<string, any> }>;

    export type func_list<T1> = (params: listParams) => listOut<T1>;
    export type func_all<T1> = (params?: listParams) => allOut<T1>;
    export type func_create<T1> = (params: recordCreate) => recordRes<T1>;
    export type func_getById<T1> = (params: recordFind) => recordRes<T1>;
    export type func_delete<T1> = (params: recordDelete) => recordRes<T1>;
    export type func_update<T1> = (params: recordUpdate) => recordRes<T1>;

    export type Service<T1> = {
        list?: func_list<T1>;
        all?: func_all<T1>;
        create?: func_create<T1>;
        getById?: func_getById<T1>;
        delete?: func_delete<T1>;
        update?: func_update<T1>;
        _buildSearchWithFullTextSearch?: (search: string, user: any, language?: string) => {
            $and: { [key: string]: any }[];
        };
    };
}

export function getQuickCrud<T1>(params: CrudQuick.crudBuild<T1>): CrudQuick.Service<T1> {
    const { Model, options = { join: [], mapRecord: null } } = params;
    function _buildSearchWithFullTextSearch(search: string, user: any, language?: string) {
        return { $and: [{ $text: { $search: search, $language: language || user.language } }] };
    }
    return {
        _buildSearchWithFullTextSearch,
        async list(params: CrudQuick.listParams): CrudQuick.listOut<T1> {
            const obj = Model?.schema.obj;
            const listFields = Object.keys(obj);

            const _limit =
                typeof params.limit === 'string'
                    ? parseInt(params.limit)
                    : params.limit || 10;
            const limit = Math.min(_limit, 500);
            const page =
                typeof params.page === 'string'
                    ? parseInt(params.page)
                    : params.page || 1;
            const {
                search = '',
                sort = params.sort || { _id: -1 },
                filter = {},
                filterCustom = {},
                user = {},
                language
            } = params;
            const join = params.join || options.join;
            const select = params.select || {};

            let queryDb = apiHelper.filter.transformFilter(filter, listFields);
            queryDb = apiHelper.filter.combineFilter(queryDb, filterCustom);
            const findOptions: any = { limit, page, sort, select };
            if (search) {
                queryDb = apiHelper.filter.combineFilter(
                    queryDb,
                    _buildSearchWithFullTextSearch(helper.changeToSlug(search), user, language)
                );
                findOptions.projection = { _score: { $meta: 'textScore' } };
                findOptions.sort = { _score: { $meta: 'textScore' }, ...sort };
            }

            console.log('queryDb', JSON.stringify(queryDb));
            // @ts-ignore
            const queryResult = await Model.paginate(queryDb, findOptions);
            let items: T1[] | Record<string, any>[] = queryResult.docs.map((item: any) => item.toJSON());
            const total = queryResult.totalDocs;

            const { totalPages } = queryResult;
            const { hasNextPage } = queryResult;
            const { hasPrevPage } = queryResult;
            // @ts-ignore
            items = await joinRecord(items, join);
            if (options.mapRecord) {
                items = await Promise.all(items.map(options.mapRecord));
            }

            return {
                items,
                limit: Number(limit),
                page: Number(page),
                sort,
                total,
                hasNextPage,
                hasPrevPage,
                totalPages,
                filter,
                filterCustom,
            };
        },
        async all(params: CrudQuick.listParams = {}): CrudQuick.allOut<T1> {
            const {
                sort = params.sort || { _id: -1 },
                filter = {},
                filterCustom = {},
                limit = 0,
                skip = 0,
                search = '',
                user = {},
                language
            } = params;
            const join = params.join || options.join;
            const select = params.select || {};
            const obj = Model?.schema.obj;
            const listFields = Object.keys(obj);

            let queryDb = apiHelper.filter.transformFilter(filter, listFields);
            queryDb = apiHelper.filter.combineFilter(queryDb, filterCustom);

            if (search)
                queryDb = apiHelper.filter.combineFilter(
                    queryDb,
                    _buildSearchWithFullTextSearch(helper.changeToSlug(search), user, language)
                );
            console.log('queryDb', JSON.stringify(queryDb));

            let items = await Model.find(queryDb)
                .select(select)
                .sort(sort)
                .limit(limit)
                .skip(skip);
            items = items.map((item: any) => item.toJSON());
            items = await joinRecord(items, join);
            if (options.mapRecord) {
                items = await Promise.all(items.map(options.mapRecord));
            }

            return { items: items, filter: filter };
        },
        async getById(params: CrudQuick.recordFind): CrudQuick.recordRes<T1> {
            const {
                id,
                filter = {},
                filterCustom = {},
                select = {},
            } = params;
            const obj = Model?.schema.obj;
            const listFields = Object.keys(obj);

            const join = params.join || options.join;

            if (!id) throw MyError.NotValidate('Thiếu id');

            let queryDb = apiHelper.filter.transformFilter(filter, listFields);
            queryDb = apiHelper.filter.combineFilter(queryDb, filterCustom);
            console.log('queryDb', JSON.stringify(queryDb));

            let record = await Model.findOne({ _id: id, ...queryDb }).select(
                select
            );
            if (!record) throw MyError.NotFound('Không tìm thấy bản ghi');
            record = record.toJSON();

            // @ts-ignore
            record = await joinRecord(record, join);
            if (options.mapRecord) {
                record = await options.mapRecord(record);
            }

            return { record };
        },
        async update(params: CrudQuick.recordUpdate): CrudQuick.recordRes<T1> {
            const {
                id,
                record,
                filter = {},
                filterCustom = {},
                select = {},
                user = {},
                session
            } = params;
            const obj = Model?.schema.obj;
            const listFields = Object.keys(obj);

            const join = params.join || options.join;

            if (!id) throw MyError.NotValidate('Thiếu id');
            if (!record || Object.keys(record).length === 0)
                throw MyError.NotValidate("'record' không nên bị rỗng");

            let queryDb = apiHelper.filter.transformFilter(filter, listFields);
            queryDb = apiHelper.filter.combineFilter(queryDb, filterCustom);
            console.log('queryDb', JSON.stringify(queryDb));

            const queryOptions: any = {};
            if(session) queryOptions.session = session;
            const recordInDb = await Model.findOne({ _id: helper.getMongoId(id), ...queryDb }, null, queryOptions).select(select);
            if (!recordInDb) throw MyError.NotFound('Không tìm thấy bản ghi');
            if (user && user.id) {
                record.updatedBy = { id: user?.id, name: user?.name || user?.fullname, email: user?.email };
                record.updatedById = user.id;
            }

            const updateData = apiHelper.filter.fieldObjectMongoDB(
                { ...record },
                listFields
            );
            let recordAfterUpdate = await Model.findByIdAndUpdate(
                id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                    ...queryOptions
                }
            ).select(select);

            recordAfterUpdate = recordAfterUpdate.toJSON();
            recordAfterUpdate = await joinRecord(recordAfterUpdate, join);
            if (options.mapRecord) {
                recordAfterUpdate = await options.mapRecord(recordAfterUpdate);
            }

            return {
                record: recordAfterUpdate,
            };
        },
        async delete(params: CrudQuick.recordDelete): CrudQuick.recordRes<T1> {
            const {
                id,
                filter = {},
                filterCustom = {},
                select = {},
                session
            } = params;
            const join = params.join || options.join;
            const obj = Model?.schema.obj;
            const listFields = Object.keys(obj);

            if (!id) throw MyError.NotValidate('Thiếu id');

            let queryDb = apiHelper.filter.transformFilter(filter, listFields);
            queryDb = apiHelper.filter.combineFilter(queryDb, filterCustom);
            console.log('queryDb', JSON.stringify(queryDb));

            const queryOptions: any = {};
            if(session) queryOptions.session = session;
            let recordInDb = await Model.findOne({ _id: helper.getMongoId(id), ...queryDb }, null, queryOptions).select(select);
            if (!recordInDb) throw MyError.NotFound('Không tìm thấy bản ghi');
            await Model.deleteOne({ _id: id }, queryOptions);

            recordInDb = recordInDb.toJSON();
            recordInDb = await joinRecord(recordInDb, join);
            if (options.mapRecord) {
                recordInDb = await options.mapRecord(recordInDb);
            }

            return {
                record: recordInDb,
            };
        },
        async create(params: CrudQuick.recordCreate): CrudQuick.recordRes<T1> {
            let { record = {} } = params;
            const { user = {}, session } = params;
            const join = params.join || options.join;
            const obj = Model?.schema.obj;
            const listFields = Object.keys(obj);
            let recordInDb;

            if (is.empty(record))
                throw MyError.NotValidate(
                    '"record" trong body không được rỗng'
                );
            if (user && user.id) {
                record.createdBy = { id: user?.id, name: user?.name || user?.fullname, email: user?.email };
                record.createdById = user.id;
            }

            const queryOptions: any = {};
            if(session) queryOptions.session = session;
            record = apiHelper.filter.fieldObjectMongoDB(record, listFields);

            // @ts-ignore
            const recordToSave = new Model(record);
            const error = recordToSave.validateSync();
            if (error) throw MyError.NotValidate(error.message, { error });

            try {
                if(session){
                    recordInDb = await Model.create([record], { session });
                    record = recordInDb[0].toJSON();
                }

                if(!session){
                    recordInDb = await Model.create(record);
                    record = recordInDb.toJSON();
                }
            } catch (error: any) {
                throw MyError.ServerError(error?.message, { error });
            }

            record = await joinRecord(record, join);
            if (options.mapRecord) {
                record = await options.mapRecord(record);
            }

            return {
                record,
            };
        },
    };
}
