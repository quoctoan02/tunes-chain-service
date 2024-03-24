import {doQuery} from "../databases";
import {ErrorCode, logger} from "../utils";

const table = `user_twitter_metrics`;

export const UserMetricModel = {
    create: async (data: any, conn: any) => {
        return doQuery.insertRow(table, data, conn);
    },

    getByType: async (type: string, value: any) => {
        return doQuery.getByType(table, type, value);
    },

    update: async (data: any, conn: any) => {
        return doQuery.updateRow(table, data, data.id, conn);
    },

    get: async (id: number) => {
        return doQuery.getById(table, id);
    },

    getByUserIdAndEpoch: async (user_id: number, epoch: number) => {
        const query = ` select * from ${table} where user_id = ? and epoch = ?`;
        return doQuery.getOne(query, [user_id, epoch]);
    },

    updateInsert: async (like_change: number, view_change: number, quote_change: number, retweet_change: number, user_id: number, epoch: number, point_change: number,conn: any) => {
        const query = ` insert into user_twitter_metrics (user_id, like_count, view_count, quote_count, retweet_count, epoch, point) 
            values (${user_id}, ${like_change}, ${view_change}, ${quote_change}, ${retweet_change}, ${epoch}, ${point_change})
            on duplicate key update like_count = like_count + ${like_change}, view_count = view_count + ${view_change}, quote_count = quote_count + ${quote_change}, retweet_count = retweet_count + ${retweet_change}, point = point + ${point_change}`;
        const [result] = await conn.query(query);
        if (!result.affectedRows) {
            logger.error('updateMetric error')
            throw ErrorCode.UNKNOWN_ERROR;
        }
        return true;
    }
}
