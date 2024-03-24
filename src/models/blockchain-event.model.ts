import { doQuery } from "../databases";
import { EventType } from "../utils";

export interface IBlockchainEvent {
    transaction_hash: string;
    token_id?: number | string | null;
    contract_id: number | string;
    block_number: number | string;
    metadata: string;
    type: EventType;
}

const TABLE = "blockchain_events";

export const BlockchainEventModel = {
    create: async (event: IBlockchainEvent, conn: any) => {
        return doQuery.insertRow(TABLE, event, conn);
    },
};
