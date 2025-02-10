import { BaseContext } from 'koa';
import { helper } from './helper';

const filter = {
    combineFilter(...filters: any[]) {
        let out: any = {
            $and: [],
            $or: [],
        };
        for (const filter of filters) {
            const { $and, $or, ..._filter } = filter;
            if ($and && $and.length) {
                out.$and = [...out.$and, ...$and];
            }
            if ($or && $or.length) {
                out.$or = [...out.$or, ...$or];
            }
            out = { ...out, ..._filter };
        }
        if (out.$and.length === 0) {
            delete out.$and;
        }
        if (out.$or.length === 0) {
            delete out.$or;
        }
        return out;
    },
    transformFilter(filter: any, listFields: string[]) {
        const newFilter: any = {};
        for (const field of Object.keys(filter)) {
            if (filter.hasOwnProperty(field)) {
                if (filter[field]) {
                    if (field === '$or' || field === '$and') {
                        if (filter[field].length) {
                            newFilter[field] = filter[field].map((obj: any) =>
                                this.transformFilter(obj, listFields)
                            );
                        }
                    } else {
                        const realField = field.split('.')[0];
                        if (
                            [
                                ...listFields,
                                'id',
                                '_id',
                                'createdAt',
                                'updatedAt',
                            ].includes(realField)
                        ) {
                            if (helper.isObject(filter[field])) {
                                newFilter[field] = this.transformFilter(
                                    filter[field],
                                    [
                                        '$eq',
                                        '$ne',
                                        '$gt',
                                        '$gte',
                                        '$lt',
                                        '$lte',
                                        '$in',
                                        '$nin',
                                        '$exists',
                                    ]
                                );
                            } else {
                                if (
                                    filter[field] == 'true' ||
                                    filter[field] == 'false'
                                ) {
                                    if (filter[field] == 'true') {
                                        newFilter[field] = true;
                                    } else if (filter[field] == 'false') {
                                        newFilter[field] = false;
                                    }
                                } else if (filter[field] == 'null') {
                                    newFilter[field] = null;
                                } else {
                                    if (field === 'id' || field === '_id') {
                                        if (filter[field].$in) {
                                            if (
                                                helper.isArray(
                                                    filter[field].$in
                                                )
                                            ) {
                                                newFilter['_id'] = {
                                                    $in: filter[field].$in.map(
                                                        (id: string) =>
                                                            helper.getMongoId(
                                                                id
                                                            )
                                                    ),
                                                };
                                            }
                                        } else {
                                            if (helper.isArray(filter[field])) {
                                                newFilter['_id'] = {
                                                    $in: filter[field].map(
                                                        (id: string) =>
                                                            helper.getMongoId(
                                                                id
                                                            )
                                                    ),
                                                };
                                            } else {
                                                newFilter['_id'] =
                                                    helper.getMongoId(
                                                        filter[field]
                                                    );
                                            }
                                        }
                                    } else {
                                        newFilter[field] = filter[field];
                                    }
                                }
                            }
                        }
                    }
                } else {
                    newFilter[field] = filter[field];
                }
            }
        }

        return newFilter;
    },
    fieldObjectMongoDB(record: any, fields: string[]) {
        const recordToDb: any = {};
        for (const field of Object.keys(record)) {
            if (field === '$set' || field === '$unset' || [...fields, '_id'].includes(field)) {
                recordToDb[field] = record[field];
            }
        }

        return recordToDb;
    },
};

export const apiSuccessHandler = {
    sendJson(ctx: BaseContext, message = '', data = {}): void {
        ctx.status = 200;
        ctx.body = {
            status: 200,
            message,
            data,
        };
    },
};

export const apiHelper = {
    filter
};
