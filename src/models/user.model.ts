import {doQuery} from '../databases';

const TABLE = 'users';

export const UserModel = {
    get: async (id: number) => {
        return doQuery.getById(TABLE, id);
    },
    getByType: async (type: string, value: string) => {
        return doQuery.getByType('users', type, value)
    },
};
