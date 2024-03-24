import {ErrorCode} from "./enum";
import {logger} from "./logger";
import {config} from "../config";
import axios, {AxiosRequestConfig, Method} from "axios";
import {TwitterAccessTokenModel} from "../models";


export const callApi = async (method: Method, endpoint: string, data: any, params: any) => {
    const headers = {
        'Authorization': `Bearer ${config.twitter.access_token}`
    }
    const axios_config: AxiosRequestConfig = {
        method: method,
        url: endpoint,
        data: data ? data : null,
        params,
        headers: headers,
        timeout: 10000,
    }

    try {
        const res = await axios(axios_config);
        return res.data;
    } catch (e) {
        logger.error('call end point: ', method, 'error: ', e);
        throw ErrorCode.UNKNOWN_ERROR;
    }
}

export const callDetailPost = async (tweet_id: number) => {
    const url = `https://twitter.com/i/api/graphql/8sK2MBRZY9z-fgmdNpR3LA/TweetDetail?variables=%7B%22focalTweetId%22%3A%22${tweet_id}%22%2C%22with_rux_injections%22%3Afalse%2C%22includePromotedContent%22%3Atrue%2C%22withCommunity%22%3Atrue%2C%22withQuickPromoteEligibilityTweetFields%22%3Atrue%2C%22withBirdwatchNotes%22%3Atrue%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Afalse%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D&fieldToggles=%7B%22withArticleRichContentState%22%3Afalse%7D`;
    const params  = {
        // variables: {"focalTweetId": `${String(tweet_id)}`,"with_rux_injections":false,"includePromotedContent":true,"withCommunity":true,"withQuickPromoteEligibilityTweetFields":true,"withBirdwatchNotes":true,"withVoice":true,"withV2Timeline":true},
        // features: {"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"tweetypie_unmention_optimization_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":false,"tweet_awards_web_tipping_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_media_download_video_enabled":false,"responsive_web_enhance_cards_enabled":false},
        // fieldToggles: {"withArticleRichContentState":false},
    }
    const twitter_access_token = await TwitterAccessTokenModel.getByType('type', 1);
    const config: any = {
        method: 'get',
        url: `https://twitter.com/i/api/graphql/8sK2MBRZY9z-fgmdNpR3LA/TweetDetail?variables=%7B%22focalTweetId%22%3A%22${tweet_id}%22%2C%22with_rux_injections%22%3Afalse%2C%22includePromotedContent%22%3Atrue%2C%22withCommunity%22%3Atrue%2C%22withQuickPromoteEligibilityTweetFields%22%3Atrue%2C%22withBirdwatchNotes%22%3Atrue%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Afalse%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D&fieldToggles=%7B%22withArticleRichContentState%22%3Afalse%7D`,
        headers: {
            'authority': 'twitter.com',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'authorization': 'Bearer ' + twitter_access_token.access_token.trim(),
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'cookie': '_ga_BYKEBDM7DS=GS1.1.1688110517.1.1.1688110669.0.0.0; guest_id=v1%3A169111629457029006; guest_id_marketing=v1%3A169111629457029006; guest_id_ads=v1%3A169111629457029006; g_state={"i_l":0}; kdt=UP3zdePWW6IZwoxbWHy2IbhIBl1x1H1rde4DkqPd; auth_token=d4640b7ff6e7d54db1ab70de1a6a43848371ddfb; twid=u%3D1687388086601449472; ct0=c8097fd5f5a70bdf8aa4b5b82455d4c821a15cb9756c21b9306b66ec361ed33e9b77472f53c42efae9d6c3e8d8d84a450d87dc72d4c0c67f5928a9547625e99831ab2dc50fd2ca468805e79ed6187116; mbox=PC#9ec1897782bd4ee4a5ac3c145d372433.38_0#1754384510|session#3f082468890f4ee3a943f229d438b4c8#1691141570; _ga_34PHSZMC42=GS1.1.1691139579.2.1.1691139713.0.0.0; _ga=GA1.2.438876469.1672308935; lang=en; _gid=GA1.2.680139235.1695617915; _twitter_sess=BAh7CSIKZmxhc2hJQzonQWN0aW9uQ29udHJvbGxlcjo6Rmxhc2g6OkZsYXNo%250ASGFzaHsABjoKQHVzZWR7ADoPY3JlYXRlZF9hdGwrCGXUZNCKAToMY3NyZl9p%250AZCIlMWVmZWU0YTNhNDVjMjJjMTZjOWFiYWMxNjQzMDI5NTg6B2lkIiU2MjAx%250AYzI1NjFjN2U3NGVhNzdiZWM2ZjkyNzcwZWU1OQ%253D%253D--68a0511a512ce5f2a617e8d4152897885dff0b04; external_referer=padhuUp37zhOF435QsA%2FXxJH0kyuEmhbIjRBte2SC4n8XNFaAhesmAlK3v603DaKr7CkD9vrM16pTgE4DHhPbrru%2B3zYqOuHPpODXLVOMwWsfOZLWBui2S742WZ6e%2F6m|0|8e8t2xd8A2w%3D; personalization_id="v1_9peCxuLutOFdUhfgotCCyA=="; guest_id=v1%3A169113988165715601; guest_id_ads=v1%3A169113988165715601; guest_id_marketing=v1%3A169113988165715601; personalization_id="v1_aHZtLoZJ6JIdUDc/j6agXg=="',
            'pragma': 'no-cache',
            'referer': 'https://twitter.com/Morbidful/status/1706411238840816008',
            'sec-ch-ua': '"Microsoft Edge";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"Android"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36 Edg/117.0.2045.36',
            'x-client-transaction-id': 'cE7hb68h905suLh53lnRUR+INtN7QGIxku0xoVcIfuaWCM5+jF/PikMhm255XtWbpSzzs3BSiJkSivZDpU3/a8VgQe37cQ',
            'x-csrf-token': 'c8097fd5f5a70bdf8aa4b5b82455d4c821a15cb9756c21b9306b66ec361ed33e9b77472f53c42efae9d6c3e8d8d84a450d87dc72d4c0c67f5928a9547625e99831ab2dc50fd2ca468805e79ed6187116',
            'x-kl-saas-ajax-request': 'Ajax_Request',
            'x-twitter-active-user': 'yes',
            'x-twitter-auth-type': 'OAuth2Session',
            'x-twitter-client-language': 'en'
        }
    };
    const headers = {
        'Authorization': `Bearer ${twitter_access_token.access_token.trim()}`
    }
    // const axios_config: AxiosRequestConfig = {
    //     method: 'GET',
    //     url,
    //     headers: headers,
    //     params,
    //     timeout: 10000,
    // }

    try {
        const res = await axios(config);
        return res.data;
    } catch (e) {
        logger.error('call end point: tweet_id: ', tweet_id ,'error: ', e);
        throw ErrorCode.UNKNOWN_ERROR;
    }
}