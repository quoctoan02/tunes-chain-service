import {ConfigKey, ErrorCode, logger, MapTweetType, SearchConfigType, TweetStatus, TweetType, Utils} from "../utils";
import {config} from "../config";
import {EpochModel, TweetSearchConfigModel, UserMetricModel, UserModel} from "../models";
import {callApi} from "../utils/call-api";
import {Redis, sql} from "../databases";
import {ITweet, TweetModel} from "../models/tweet.model";
import {ConfigModel} from "../models/config.model";


const crawlTweet = async () => {
    try {
        logger.info('craw tweet service run!');
        const url = `${config.twitter.v2_end_point}/tweets/search/recent`
        const searchConfig = await TweetSearchConfigModel.getByType('type', SearchConfigType.SEARCH_POST);
        if (!searchConfig) throw ErrorCode.CONFIG_INVALID;
        let params: any = {
            query: searchConfig.query_string,
            'tweet.fields': 'author_id,created_at,public_metrics,attachments,context_annotations,conversation_id,entities,possibly_sensitive,referenced_tweets,source,withheld,lang',
            sort_order: 'recency',
            max_results: searchConfig.per_page,
        }
        if (searchConfig.since_id) {
            params = {...params, since_id: searchConfig.since_id,}
        }
        const data = await callApi('GET', url, {}, params);
        if (!data.meta?.result_count) {
            logger.warn(' Nothing new');
            return;
        }
        const {metadata: { max_tweet_per_day }} = await ConfigModel.getByKey(ConfigKey.TWEET_CONFIG)
        logger.info('Found: ', data?.data?.length, ' tweet')
        const {metadata} = await ConfigModel.getByKey(ConfigKey.POINT_CONFIG);
        const conn = await sql.getConnection();
        try {
            await conn.beginTransaction();
            logger.trace('begin transaction');
            for (const item of data.data) {
                const tweet_date = new Date(item.created_at);
                const user = await UserModel.getByType('twitter_id', item.author_id);
                const epoch = await EpochModel.getByDate(Math.round(new Date(item.created_at).getTime()/1000))
                let isInsert = true;
                if (!epoch) {
                    logger.warn('Epoch not exist')
                }
                if (epoch) {
                    const key = `epoch:${epoch.id}:count_tweet_date:${tweet_date.toISOString().split('T')[0]}`;
                    let userTweetCount = 0;
                    if (user) {
                        userTweetCount = Number(await Redis.defaultCli.hget(key, `user_id:${user?.id}`));
                        logger.info('User Id: ', user.id, ' Tweet today: ', userTweetCount, ' max_tweet_per_day: ', max_tweet_per_day);
                        if (userTweetCount && userTweetCount >= max_tweet_per_day) {
                            isInsert = false;
                        }
                    }
                    let tweet_type = MapTweetType[item.referenced_tweets[0].type];
                    if (!item.referenced_tweets) {
                        tweet_type = TweetType.ORIGINAL;
                    }
                    const point = tweet_type == TweetType.ORIGINAL ? Utils.calPoint(metadata, {...item.public_metrics, view_count: item.public_metrics.impression_count}): 0;
                    const tweet: ITweet = {
                        user_id: user?.id,
                        tweet_id: item.id,
                        author_id: item.author_id,
                        context_annotations: JSON.stringify(item.context_annotations),
                        conversation_id: item.conversation_id,
                        tweet_source: item.source,
                        referenced_tweets: JSON.stringify(item.referenced_tweets),
                        create_tweet_time: new Date(item.created_at),
                        lang: item.lang,
                        tweet_text: item.text,
                        entities: JSON.stringify(item.entities),
                        possibly_sensitive: item.possibly_sensitive,
                        reply_settings: JSON.stringify(item.reply_settings),
                        status: TweetStatus.NOT_CHECK,
                        withheld: JSON.stringify(item.withheld),
                        public_metrics: JSON.stringify(item.public_metrics),
                        epoch: epoch.id,
                        last_metric_time: Date.now(),
                        point,
                        type: tweet_type,
                    }
                    logger.info({
                        isInsert
                    })
                    if (isInsert) {
                        await Redis.defaultCli.hset(key, `user_id:${user?.id}`, String(userTweetCount + 1))
                        const {like_count, quote_count, retweet_count, impression_count} = item.public_metrics;
                        if (user && tweet_type == TweetType.ORIGINAL) {
                            await UserMetricModel.updateInsert(like_count, impression_count, quote_count, retweet_count, user.id, epoch.id, point, conn);
                        }
                        await TweetModel.create(tweet, conn);
                    }
                }
            }
            await TweetSearchConfigModel.update({
                id: searchConfig.id,
                since_id: data.meta.newest_id,
                next_token: data.meta.next_token,
            }, conn)
            logger.trace('Commit transaction')
            await conn.commit();
        }catch (e) {
            logger.error('Sync Tweet Error ', e);
            await conn.rollback();
        }finally {
            await conn.release();
        }

    } catch (e) {
        logger.error(e);
    }
}

const run_process = async () => {
    try {
        await crawlTweet();
    } catch (e) {
        logger.error(e);
    } finally {
        setTimeout(run_process, 300000);
    }
}

export const CrawlTweetService = {
    run_process,
}
if (config.direct_service) {
    CrawlTweetService.run_process();
}