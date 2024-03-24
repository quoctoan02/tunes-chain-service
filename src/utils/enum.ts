export enum ErrorCode {
    NO_ERROR,
    UNKNOWN_ERROR,
    PERMISSION_DENIED,
    CONFIG_INVALID,
    PARAMS_INVALID,
    TOKEN_IS_INVALID,
    CAPTCHA_IS_INVALID,
    DUPLICATE_LOGIN,
    HEALTH_CHECK_ERROR,
    UPDATE_ZERO_FIELD,
    REQUEST_TIMEOUT,
    TOO_MANY_REQUEST,
    OTP_INVALID_OR_EXPIRED,
    FILE_NOT_FOUND,
    TEST_NET_DAY_ERROR = 14,

    // User
    USER_INVALID = 1000,
    USER_NOT_FOUND,

    //Contracts
    CONTRACT_NOT_EXISTED = 2000,

    //nft
    NFT_COLLECTION_NOT_EXIST = 2001,
    ABI_NOT_EXIST,
    COLLECTION_INVALID,
    CANNOT_MINT_ANY_NFT,
}

export enum HttpStatus {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRE = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    REQUEST_TIMEOUT = 408,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUEST = 429,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    SERVICE_UNAVAILABLE = 503,
}

export enum BalanceHistoryType {
    DEPOSIT = 1,
    WITHDRAWAL = 2,
    WITHDRAWAL_FAILED = 3,
}

export enum ConfigKey {
    RARE_NFT_CONFIG = "RARE_NFT_CONFIG",
    NFT_TOTAL_SUPPLY = "NFT_TOTAL_SUPPLY",
    TWEET_CONFIG = 'TWEET_CONFIG',
    POINT_CONFIG = 'POINT_CONFIG',
}

export enum ConfigType {
    NFT_TOTAL_SUPPLY = 10,
}

export enum EventType {
    CREATE = 1,
    TRANSFER,
    DEPOSIT,
}

export enum ActiveStatus {
    ACTIVATED = 1,
    UNACTIVATED = 2,
}

export enum UserStatus {
    DEACTIVATED = 1,
    ACTIVATED,
    BANNED,
}

export enum WithdrawalStatus {
    REQUESTED = 1,
    DONE = 2,
    FAILED,
}

export enum Currency {
    USDT = "USDT",
}

export enum NftCollectionType {
    NFT = 1,
    MARKET_PLACE_NFT = 2,
}

export enum NftMetadataStatus {
    AVAILABLE = 1,
    USED = 2,
}

export enum NftEventType {
    CREATE = 1,
    TRANSFER,
    SET_PRICE,
    SOLD,
    BURNED,
    CANCEL_ORDER,
    COMBINE,
}

export enum NftSaleStatus {
    NOT_SALE = 1,
    SELLING = 2,
}

export enum NftStatus {
    NOT_OPEN = 1,
    OPENED = 2,
}

export enum NftBoardLevel {
    LEVEL_1 = 1,
    LEVEL_2,
    LEVEL_3,
    LEVEL_4,
    LEVEL_5,
    LEVEL_6,
}

export enum NftBoardStatus {
    EMPTY = 1,
    ADDED = 2,
}

export enum ContractType {
    COMBINE = 1,
    NFT = 2,
    DEPOSIT_CLAIM,
}

export enum BlockchainEventType {
    CREATE = 1,
    TRANSFER,
    SET_PRICE,
    SOLD,
    BURNED,
    CANCEL_ORDER,
}

export const rootAddress = "0x0000000000000000000000000000000000000000";
export enum SearchConfigType {
    SEARCH_POST = 1,
}

export enum TweetStatus {
    NOT_CHECK = 1,
    CHECKED = 2,
}

export enum TweetType {
    ORIGINAL = 1,
    RETWEET= 2,
    QUOTE = 3,
    KICKBACK = 4,
}

export const MapTweetType: any = {
    quoted : TweetType.QUOTE,
    retweeted: TweetType.RETWEET,
}

export enum CombineHistoryStatus {
    REQUESTED = 1,
    DONE = 2,
    FAILED = 3,
}
