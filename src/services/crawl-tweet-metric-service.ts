import {ConfigKey, logger, TweetType, Utils} from "../utils";
import {config} from "../config";
import {EpochModel, UserMetricModel, UserModel} from "../models";
import {callDetailPost} from "../utils/call-api";
import {sql} from "../databases";
import {TweetModel} from "../models/tweet.model";
import {ConfigModel} from "../models/config.model";


const crawlTweet = async () => {
    try {
        logger.info('craw tweet detail service run!');
        const {metadata: { sync_metric_duration }} = await ConfigModel.getByKey(ConfigKey.TWEET_CONFIG);
        const epoch = await EpochModel.getByDate(Math.round(Date.now() / 1000));
        if (!epoch) {
            logger.warn('Not in any epoch');
            return;
        }
        const {data: tweets} = await TweetModel.list({sync_metric_duration, order_by: 'last_metric_time', reverse: false, type: TweetType.ORIGINAL, epoch: epoch.id});
        if (!tweets.length) {
            logger.warn(' Nothing can sync metric now');
            return;
        }
        const {metadata} = await ConfigModel.getByKey(ConfigKey.POINT_CONFIG);
        for (const tweet of tweets) {
            //todo start calculate change metric;
            const user = await UserModel.getByType('twitter_id', tweet.author_id);
            if (user) {
                    const detailTweet = await callDetailPost(tweet.tweet_id);
                const result = detailTweet.data.threaded_conversation_with_injections_v2.instructions[0].entries[0].content.itemContent.tweet_results.result;
                const {favorite_count: like_count, quote_count, retweet_count} = result.legacy;
                const {count: view_count} = result.views;
                logger.info({
                    like_count,
                    quote_count,
                    retweet_count,
                    view_count,
                    epoch: tweet.epoch,
                })
                const {public_metrics} = tweet;
                const point = Utils.calPoint(metadata, {
                    like_count,
                    quote_count,
                    retweet_count,
                    view_count,
                })
                const change_like = like_count - public_metrics.like_count;
                const change_quote = quote_count - public_metrics.quote_count;
                const change_retweet = retweet_count - public_metrics.retweet_count;
                const change_view = view_count - public_metrics.impression_count;
                const change_point = point - tweet.point;
                //todo end calculate change metric;
                //todo update or insert new user metric;
                const conn = await sql.getConnection();
                try {
                    await conn.query('START TRANSACTION');
                    logger.trace('START TRANSACTION');

                    await UserMetricModel.updateInsert(change_like, change_view, change_quote, change_retweet, user.id, tweet.epoch, change_point, conn);
                    //todo update tweet public metric and last_metric_time point;
                    await TweetModel.update({
                        id: tweet.id,
                        public_metrics: JSON.stringify({
                            like_count,
                            impression_count: view_count,
                            quote_count,
                            retweet_count
                        }),
                        last_metric_time: Date.now(),
                        point,
                    }, conn)
                    logger.trace(' Commit Transaction ')
                    await conn.query('COMMIT');
                } catch (e) {
                    logger.error('Sync Tweet Error ', e);
                    await conn.query('ROLLBACK');
                } finally {
                    logger.trace(' Release Transaction ')
                    conn.release();
                }
            }

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
        setTimeout(run_process, 180000);
    }
}

export const CrawlTweetMetricService = {
    run_process,
}
if (config.direct_service) {
    CrawlTweetMetricService.run_process();
}