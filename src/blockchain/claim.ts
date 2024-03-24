import {ethers} from 'ethers';
import claim_abi from "../../assets/ClaimABI.json"
import {ETH} from "./eth";


const get_contract = (blockchain: any, contract_address: string) => {
    return new ethers.Contract(
        contract_address,
        claim_abi,
        ETH.get_provider(blockchain),
    )
}

export const Claim = {
    getClaimById: async (blockchain: any, claimId: number, claim_address: string) => {
        const contract = get_contract(blockchain, claim_address);
        return contract.claimHistory(claimId);
    },
}
