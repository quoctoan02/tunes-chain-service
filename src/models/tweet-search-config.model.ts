import {doQuery} from "../databases";

const table = `tweet_search_config`;

export const TweetSearchConfigModel = {

    getByType: async (type: string, value: any) => {
        return doQuery.getByType(table, type, value);
    },

    update: async (data: any, conn: any) => {
        return doQuery.updateRow(table, data, data.id, conn);
    },

    get: async (id: number) => {
        return doQuery.getById(table, id);
    },

    list: async (data: any) => {
        let query = ` select * from ${table} where 1 = 1 `;
        const fields: any[] = [];
        [''].forEach(value => {
            if (data[value]) {
                query += ` lower(${value}) = lower(?)`;
                fields.push(data[value])
            }
        })
        return {
            data: await doQuery.listRows(query, fields, data),
            total: await doQuery.countRows(query, fields)
        }
    },
}
