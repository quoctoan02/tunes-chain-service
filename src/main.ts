"use strict";

import { logger } from "./utils";
import { TokenCheckerService } from "./services/token_checker";
import { ClaimCheckerService } from "./services/claim_checker";
import { CrawlTweetService } from "./services/crawl-tweet-service";
import { NftSupplyService } from "./services/nft_supply_checker";
import {CrawlTweetMetricService} from "./services/crawl-tweet-metric-service";

const main = async () => {
    const runService = process.env.__SERVICE_NAME__;
    logger.info("Running service: ", runService);
    switch (runService) {
        case "token_checker": {
            await TokenCheckerService.run_process();
            break;
        }
        case "claim_checker": {
            await ClaimCheckerService.run_process();
            break;
        }
        default:
            break;
    }
};

main().catch((e) => logger.error(e));