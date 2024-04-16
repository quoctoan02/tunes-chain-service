import {ContractType, logger, WithdrawalStatus} from "../utils";
import {BlockchainModel, ContractModel} from "../models";
import {config} from "../config";
import {Claim} from "../blockchain/claim";
import {WithdrawalModel} from "../models/withdrawal.model";

const claim_checker = async () => {
    try {
        logger.info('process start run!');
        const blockchains = await BlockchainModel.list();
        // get list pending withdrawal
        const list = (await WithdrawalModel.list({status: WithdrawalStatus.REQUESTED})).data;
        const claim_contract = await ContractModel.getByType('type', ContractType.TOKEN_CLAIM);
        for (let withdrawal of list) {
            // get claim info
            const claimInfo = await Claim.getClaimById(blockchains[0], withdrawal.id, claim_contract.address);
            logger.info('claimInfo', claimInfo)
            if (claimInfo) {
                logger.trace('withdrawal succeeded', withdrawal);
                await WithdrawalModel.withdrawalDone(withdrawal);
            } else if ((new Date(withdrawal.created_time)).getTime() + 180000 < Date.now()) {
                logger.trace('withdrawal failed', withdrawal);
                await WithdrawalModel.withdrawalFailed(withdrawal);
            } 
        }

        // update status
    } catch (e) {
        logger.error(e);
    }
}

const run_process = async () => {
    try {
        await claim_checker();
    } catch (e) {
        logger.error(e);
    } finally {
        setTimeout(run_process, 5000);
    }
}

export const ClaimCheckerService = {
    run_process,
}
if (config.direct_service) {
    ClaimCheckerService.run_process();
}