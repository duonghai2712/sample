export type T__RequestList = {
    search?: string,
    user?: any,
    filter?: Record<string, any>;
    filterCustom?: Record<string, any>;
    skip?: number;
    limit?: number | string;
    page?: number | string;
    select?: any;
    join?: any;
    sort?: { [key: string]: number };
};

export type T__ResponseList<T> = {
    items: T[] | Record<string, any>[],
    search?: string,
    user?: any,
    hasNextPage?: boolean,
    hasPrevPage?: boolean,
    total?: number,
    totalPages?: number | string,
    filter?: Record<string, any>;
    skip?: number;
    limit?: number | string;
    page?: number | string;
    select?: any;
    join?: any;
    sort?: { [key: string]: number };
};

export type T__RequestCreate<T> = {
    user?: any,
    filterCustom?: Record<string, any>;
    record: T;
};

export type T__RequestUpdate<T> = {
    id: string,
    user?: any,
    filterCustom?: Record<string, any>;
    record: T;
};

export type T__RequestGetById = {
    id: string,
    user?: any,
    filter?: Record<string, any>;
    filterCustom?: Record<string, any>;
};

export type T__RequestDelete = {
    id: string,
    user?: any,
    filter?: Record<string, any>;
    filterCustom?: Record<string, any>;
};

export type T__Response<T> = {
    record: T | Record<string, any>,
};
