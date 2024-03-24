import { CombineHistoryStatus, ContractType, ErrorCode, logger, NftBoardStatus, NftCollectionType, NftEventType, NftMetadataStatus, NftSaleStatus, rootAddress, Utils } from "../utils";
import { BlockchainEventModel, NftBoardModel, NftModel, UserModel } from "../models";
import { ethers } from "ethers";
import { NftMetadataModel } from "../models/nft-metadata";
import { CombineHistoryModel } from "../models/combine-history.model";

const Web3Utils = require("web3-utils");

const mapContractComnineType: any = {
    [ContractType.COMBINE]: ContractType.NFT,
};

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
    await remove_nft_from_board(collection.id, token_id, conn);
    await BlockchainEventModel.create(nft_event, conn);
};

export const combine = async (log_data: any, collection: any, log: any, contract_list: any, conn: any) => {
    const token_id_refund = Web3Utils.hexToNumberString(log_data.args.token_id_refund);
    const combine_history_id = Web3Utils.hexToNumberString(log_data.args.combine_history_id);
    const to_address = log_data.args.toAddress.toLowerCase();
    logger.trace("combine_history_id", combine_history_id);
    logger.trace("token_id_refund", token_id_refund);
    console.log("to_address", to_address);
    // const is_burn = to_address === rootAddress;
    // logger.trace("event:", is_mint ? " mint " : is_burn ? " burn " : " transfer ", "token_id_refund", token_id_refund);
    const nft_event: any = {
        transaction_hash: log.transactionHash,
        token_id: token_id_refund,
        contract_id: collection.id,
        block_number: log.blockNumber,
        metadata: JSON.stringify({ to_address, token_id_refund, combine_history_id }),
        type: NftEventType.COMBINE,
    };

    const rare_target = await calc_rare_target(combine_history_id);
    const nft_metadata = await NftMetadataModel.get_by_rare(rare_target);
    const { id, name, rare, multiplier, value, ...metadata } = nft_metadata;
    const contract_nft = contract_list.find((x: any) => x.type == mapContractComnineType[collection.type]);
    await NftModel.combine(
        {
            token_id: token_id_refund,
            contract_id: contract_nft.id,
            rare: rare,
            value: value,
            metadata: JSON.stringify({
                ...metadata,
                name: name + " #" + token_id_refund,
                attributes: [
                    {
                        trait_type: "Multiplier",
                        value: String(multiplier),
                    },
                ],
            }),
        },
        conn
    );
    await CombineHistoryModel.update(
        {
            id: combine_history_id,
            status: CombineHistoryStatus.DONE,
        },
        conn
    );
    await BlockchainEventModel.create(nft_event, conn);
};

const remove_nft_from_board = async (collection_id: number, token_id: number, conn?: any) => {
    const nft = await NftModel.get(collection_id, token_id);
    const nft_board = await NftBoardModel.getByNftId(nft.id);
    if (nft_board) {
        await NftBoardModel.update(
            {
                id: nft_board.id,
                nft_id: null,
                status: NftBoardStatus.EMPTY,
            },
            conn
        );
    }
    return 1;
};

const calc_rare_target = async (combine_history_id: number) => {
    const combine_history = await CombineHistoryModel.get(combine_history_id);
    const total_value_combine = (await NftModel.get_total_value_by_token_ids(1, combine_history.metadata)).total_value;
    const list_nft_metadatas = await NftMetadataModel.list();
    let rare_target = 1;
    let value_target = -1;
    for (let nft_metadata of list_nft_metadatas) {
        if (nft_metadata.value <= total_value_combine && nft_metadata.value > value_target) {
            value_target = nft_metadata.value;
            rare_target = nft_metadata.level;
        }
    }
    return rare_target;
};

// export const mintNft = async (log_data: any, collection: any, log: any, blockchain: any, conn: any) => {
//     const nft_collection = await NftCollectionModel.getByType("type", NftCollectionType.NFT);
//     const token_id = Number(Web3Utils.hexToNumberString(log_data.args.tokenId));
//     const to_address = log_data.args.toAddress.toLowerCase();
//     const data_event = JSON.stringify({
//         token_id,
//         to_address,
//     });

//     const nft_event = generateEvent(log, data_event, NftEventType.CREATE, token_id, nft_collection.id);
//     logger.trace("token_id minted = ", token_id);

//     const nft_metadata = await generate_metadata(conn);
//     const { id, name, ...metadata } = nft_metadata;
//     const nft: any = {
//         token_id,
//         contract_id: collection.id,
//         owner: to_address,
//         metadata_id: id,
//         metadata: JSON.stringify({
//             ...metadata,
//             name: name + " #" + token_id,
//             metadata_id: id,
//         }),
//     };
//     await NftModel.create(nft, conn);
//     await BlockchainEventModel.create(nft_event, conn);
// };

// const getTokenIdCollectionAndNft = async (log_data: any, nft_collections_list: any[], collectionType: any) => {
//     const collection_nft = nft_collections_list.find((x) => x.type == mapCollectionOrderType[collectionType]);
//     const token_id = Web3Utils.hexToNumberString(log_data.args.tokenId);
//     if (!collection_nft) throw ErrorCode.COLLECTION_INVALID;
//     const nft = await NftModel.get_by_token_id(collection_nft.id, token_id);
//     return { token_id, collection_nft, nft };
// };

// const generateEvent = (log: any, metadata: any, type: NftEventType, token_id: any, contract_id: number) => {
//     return {
//         transaction_hash: log.transactionHash,
//         token_id,
//         block_number: log.blockNumber,
//         contract_id,
//         type,
//         metadata,
//     };
// };

// const generate_metadata = async (conn?: any) => {
//     const nft_metadata = await NftMetadataModel.get_random_nft_metadatas();
//     if (!nft_metadata) {
//         throw ErrorCode.CANNOT_MINT_ANY_NFT;
//     }
//     await NftMetadataModel.update(
//         {
//             id: nft_metadata.id,
//             status: NftMetadataStatus.USED,
//         },
//         conn
//     );
//     return nft_metadata;
// };
