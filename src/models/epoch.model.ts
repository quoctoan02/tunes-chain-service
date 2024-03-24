import {doQuery} from "../databases";

const table = `epochs`;

export const EpochModel = {

    getByType: async (type: string, value: any) => {
        return doQuery.getByType(table, type, value);
    },

    get: async (id: number) => {
        return doQuery.getById(table, id);
    },

    getByDate: async (epoch_timestamp: any) => {
        const query = ` select * from ${table} where ${epoch_timestamp} between unix_timestamp(start_date) and unix_timestamp(end_date)`;
        console.log(query);
        return doQuery.getOne(query);
    }
}
