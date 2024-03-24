import {ethers} from 'ethers';

const Web3 = require('web3');

const providers: any = {};

const get_provider = (blockchain: any) => {
    if (!providers[blockchain.symbol]) {
        providers[blockchain.symbol] = new ethers.providers.JsonRpcProvider(
            blockchain.rpc_url, {name: blockchain.name, chainId: blockchain.chain_id});
    }
    return providers[blockchain.symbol];
}
export const ETH = {
    get_provider: (blockchain: any) => {
        return get_provider(blockchain);
    },
    block_number: async (blockchain: any) => {
        return get_provider(blockchain).getBlockNumber();
    },
    getTransaction: async (blockchain: any, transactionHash: string) => {
        return get_provider(blockchain).getTransaction(transactionHash);
    },
    get_logs: async (blockchain: any, from: number, to: number, addresses: string[]) => {
        const web3 = new Web3(blockchain.rpc_url);
        return web3.eth.getPastLogs({
            address: addresses,
            fromBlock: from,
            toBlock: to
        });
    }
}
