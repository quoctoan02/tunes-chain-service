import {doQuery} from "../databases";
import {logger, TweetStatus, TweetType} from "../utils";

const table = `tweets`;

export interface ITweet {
    user_id: number;
    tweet_id: string;
    tweet_text: string;
    author_id: string;
    context_annotations: any;
    conversation_id: string;
    create_tweet_time: Date;
    entities: any;
    lang: string;
    possibly_sensitive: boolean;
    referenced_tweets: any;
    tweet_source: string;
    withheld: any;
    reply_settings: string;
    public_metrics: any;
    status: TweetStatus;
    epoch: number;
    last_metric_time: number;
    point: number;
    type: TweetType;
}

export const TweetModel = {
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

    list: async (data: any) => {
        let query = ` select * from ${table} where 1 = 1  and  ${Date.now() - data.sync_metric_duration} >= last_metric_time `;
        const fields: any[] = [];
        ['type', 'epoch'].forEach(value => {
            if (data[value]) {
                query += ` and lower(${value}) = lower(?)`;
                fields.push(data[value])
            }
        })
        return {
            data: await doQuery.listRows(query, fields, data),
            total: await doQuery.countRows(query, fields)
        }
    },

    updateInsert:async (tweet: ITweet, conn: any) => {
        const query = `INSERT INTO tweets(${Object.keys(tweet).join(',')}) VALUES (${''.padStart((Object.values(tweet).length * 2) - 1, '?,')}) on duplicate key update public_metrics = '${tweet.public_metrics}' `;
        logger.trace(query)
        await conn.query(query, Object.values(tweet));
    }
}
