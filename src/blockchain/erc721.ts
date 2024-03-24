import { logger } from "../utils";

import { ethers } from "ethers";
import { config } from "../config";
import nft_abi from "../../assets/NFTABI.json";
import { ETH } from "./eth";

const get_contract = (blockchain: any, contract_address: string) => {
    return new ethers.Contract(contract_address, nft_abi, ETH.get_provider(blockchain));
};

export const Erc721 = {
    totalSupply: async (blockchain: any, contract_address: string) => {
        return get_contract(blockchain, contract_address).totalSupply();
    },
    balanceOf: async (blockchain: any, contract_address: string, address: string) => {
        const balance = await get_contract(blockchain, contract_address).balanceOf(address);
        return balance;
    },
};
