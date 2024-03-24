import {doQuery, sql} from '../databases';
import {ErrorCode, logger, UserStatus} from '../utils';

export const UserModel = {
    get: async (userId:number) => {
        let query: string = `select * from users where id = ?`;
        return doQuery.getOne(query, [userId]);
    },
    getByType: async (type: string, value: string) => {
        const query: string = `select * from users where LOWER(${type}) = ?`;
        return doQuery.getOne(query, [value.trim().toLowerCase()])
    },
    create: async (data: any) => {
        const item: any = {
            status: UserStatus.ACTIVATED
        };
        if (data.email) item.email = data.email.trim().toLowerCase();
        if (data.mobile) item.mobile = data.mobile;
        if (data.name) item.name = data.name;
        if (data.gender) item.gender = data.gender;

        let conn = await sql.getConnection();
        try {
            await conn.query("START TRANSACTION");
            logger.trace("start transaction");

            // create user
            let user_id = await doQuery.insertRow('users', item, conn);
            // create password
            data.user_id = user_id;
            // init item default
            await conn.query("COMMIT");
            logger.trace("transaction COMMIT");
            conn.release();
            logger.trace("transaction release");
            return user_id;
        } catch (e) {
            logger.error(e);
            await conn.query("ROLLBACK");
            conn.release();
            throw ErrorCode.UNKNOWN_ERROR;
        }
    },

    update: async (data: any) => {
        const item: any = {}
        if (data.email) item.email = data.email;
        if (data.mobile) item.mobile = data.mobile;
        if (data.name) item.mobile = data.name;
        if (data.gender) item.gender = data.gender;
        if (data.last_read_notification) item.last_read_notification = data.last_read_notification;
        if (data.level) item.level = data.level;
        if (data.status != undefined) item.status = data.status;
        return doQuery.updateRow('users', item, data.user_id)
    },

};
