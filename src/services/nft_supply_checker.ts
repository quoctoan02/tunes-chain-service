import { ContractType, logger, WithdrawalStatus } from "../utils";
import { BlockchainModel, ContractModel } from "../models";
import { config } from "../config";
import { NftCollectionModel } from "../models/contract";
import { Erc721 } from "../blockchain/erc721";
import { ConfigModel } from "../models/config.model";
const Web3Utils = require("web3-utils");

const nft_supply_checker = async () => {
    try {
        logger.info("process start run!");
        const blockchains = await BlockchainModel.list();
        // get list pending withdrawal
        const nft_collections_list: any[] = await NftCollectionModel.list_nft({
            blockchain_id: blockchains[0].id,
            type: [ContractType.NFT],
        });
        let total_supply = await Erc721.totalSupply(blockchains[0], nft_collections_list[0].address);
        if (total_supply) {
            await ConfigModel.update_nft_total_supply_config({
                total_supply: total_supply,
            });
        }

        // update status
    } catch (e) {
        logger.error(e);
    }
};

const run_process = async () => {
    try {
        await nft_supply_checker();
    } catch (e) {
        logger.error(e);
    } finally {
        setTimeout(run_process, 5000);
    }
};

export const NftSupplyService = {
    run_process,
};
if (config.direct_service) {
    NftSupplyService.run_process();
}
