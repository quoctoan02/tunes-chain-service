import {doQuery} from "../databases";

const table = `twitter_access_token`;

export const TwitterAccessTokenModel = {
    getByType: async (type: string, value: any) => {
        return doQuery.getByType(table, type, value);
    },
}
