import { CombineHistoryStatus, ContractType, ErrorCode, logger, NftBoardStatus, NftCollectionType, NftEventType, NftMetadataStatus, NftSaleStatus, rootAddress, Utils } from "../utils";
import { BlockchainEventModel, NftBoardModel, NftModel, UserModel } from "../models";
import { ethers } from "ethers";
import { NftMetadataModel } from "../models/nft-metadata";
import { CombineHistoryModel } from "../models/combine-history.model";

const Web3Utils = require("web3-utils");
export const transfer = async (log_data: any, collection: any, log: any, blockchain: any, conn: any) => {
    const token_id = Web3Utils.hexToNumberString(log_data.args.tokenId);
    logger.trace("token_id", token_id);
    const to_address = log_data.args.to.toLowerCase();
    const from_address = log_data.args.from.toLowerCase();
    console.log({ to_address });
    console.log({ from_address });
    const is_mint = from_address === rootAddress;
    const is_burn = to_address === rootAddress;
    logger.trace("event:", is_mint ? " mint " : is_burn ? " burn " : " transfer ", "token_id", token_id);
    const nft_event: any = {
        transaction_hash: log.transactionHash,
        token_id,
        contract_id: collection.id,
        block_number: log.blockNumber,
        metadata: JSON.stringify({ to_address, from_address }),
        type: is_mint ? NftEventType.CREATE : is_burn ? NftEventType.BURNED : NftEventType.TRANSFER,
        // type: is_mint ? NftEventType.TRANSFER : is_burn ? NftEventType.BURNED : NftEventType.TRANSFER,
    };
    let nft: any = {
        token_id,
        contract_id: collection.id,
    };

    // if (is_mint) {
    //     // nft.owner = to_address;
    //     // // check collection = Nft
    //     // const is_mint_nft = collection.type == NftCollectionType.NFT;
    //     // if (is_mint_nft) {
    //     //     await NftModel.mintNftAsync(nft, conn);
    //     // }
    //     // if (!is_mint_nft) {
    //     //     await NftModel.create(nft, conn);
    //     // }
    // } else
    if (is_burn) {
        await NftModel.burn(nft, conn);
    } else {
        await NftModel.transfer(collection.id, token_id, to_address, conn);
    }
    await BlockchainEventModel.create(nft_event, conn);
};

export const buySong = async (log_data: any, collection: any, log: any, contract_list: any, conn: any) => {
    const from = log_data.args.from;
    const buySongId = Web3Utils.hexToNumberString(log_data.args.buySongId);
    const price =  ethers.utils.formatEther(log_data.args.price.toString());

    console.log(price)

};