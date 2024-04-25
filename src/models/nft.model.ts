import { doQuery, sql } from "../databases";
import { ActiveStatus, ErrorCode, logger, rootAddress } from "../utils";

export const NftModel = {
    list: async (data: any = {}) => {
        let query: string = `select n.*, nc.address, nc.name as contract_name, nc.type as nft_type
                             from nfts n
                             inner join nft_collections nc on n.contract_id = nc.id
                             where n.status = ${ActiveStatus.ACTIVATED}`;

        const filters: any[] = [];
        ["owner"].forEach((item) => {
            if (data[item]) {
                filters.push({
                    type: "equal",
                    key: item,
                    value: data[item].toLowerCase(),
                });
            }
        });

        return {
            data: await doQuery.listRows(query, data, filters),
            total: await doQuery.countRows(query, filters),
        };
    },
    get: async (contract_id: number, token_id: number) => {
        let query: string = `select  n.*, nc.address as collection_address, nc.name as collection_name
                                from nfts n
                                inner join contracts nc on n.contract_id = nc.id
                                where contract_id = ? and token_id = ?`;
        let [result, ignored]: any[] = await sql.query(query, [contract_id, token_id]);
        return result.length ? result[0] : null;
    },
    get_by_transaction_id: async (transaction_id: string) => {
        const query: string = `select *
                             from nfts
                             where token_id =
                                   (select token_id from nft_events where transaction_id = '${transaction_id.toLowerCase()}')`;
        let [result, ignored]: any[] = await sql.query(query);
        return result.length ? result[0] : null;
    },
    get_by_token_id: async (contract_id: number, token_id: number) => {
        const query: string = `select n.*, nc.address, nc.name as contract_name, nc.type as nft_type
                             from nfts n
                             inner join nft_collections nc on n.contract_id = nc.id
                             where n.token_id = ${token_id} and n.contract_id = ${contract_id}`;
        return doQuery.getOne(query);
    },
    get_by_token_ids: async (contract_id: number, token_ids: Array<number>) => {
        const query: string = `select n.*
                             from nfts n
                             where n.token_id in (${token_ids.join(", ")}) and n.contract_id = ${contract_id}`;
        let [result, ignored]: any[] = await sql.query(query);
        return result;
    },
    get_total_value_by_token_ids: async (contract_id: number, token_ids: Array<number>) => {
        const query: string = `select sum(n.value) as total_value
                             from nfts n
                             where n.token_id in (${token_ids.join(", ")}) and n.contract_id = ${contract_id}`;
        let [result, ignored]: any[] = await sql.query(query);
        return result.length ? result[0] : null;
    },
    create: async (data: any, conn?: any) => {
        return doQuery.insertRow("nfts", data, conn);
    },
    mintNftAsync: async (data: any, conn?: any) => {
        if (!conn) conn = sql;
        let query = `update nfts
                     SET owner = '${data.owner}'
                     WHERE token_id = ${data.token_id} and contract_id = ${data.contract_id}`;
        logger.info(query);
        let [result, ignored] = await conn.query(query);

        // @ts-ignore
        if (result.affectedRows !== 1) throw ErrorCode.UPDATE_ZERO_FIELD;
    },
    burn: async (data: any, conn?: any) => {
        if (!conn) conn = sql;
        let query = `update nfts
                     SET status = '${ActiveStatus.UNACTIVATED}', owner = '${rootAddress}'
                     WHERE token_id = ${data.token_id} and contract_id = ${data.contract_id}`;
        logger.info(query);
        let [result, ignored] = await conn.query(query);

        // @ts-ignore
        if (result.affectedRows !== 1) throw ErrorCode.UPDATE_ZERO_FIELD;
    },
    transfer: async (contract_id: number, token_id: number, address: string, conn?: any) => {
        if (!conn) conn = sql;
        let query = `update nfts
                     SET owner = '${address}'
                     WHERE token_id = ${token_id} and contract_id = ${contract_id}`;
        let [result, ignored] = await conn.query(query);
        return result.affectedRows !== 0;
    },
    combine: async (data: any, conn?: any) => {
        if (!conn) conn = sql;
        let query = `update nfts
                     SET metadata = '${data.metadata}', rare = '${data.rare}', value = '${data.value}'
                     WHERE token_id = ${data.token_id} and contract_id = ${data.contract_id}`;
        let [result, ignored] = await conn.query(query);

        // @ts-ignore
        if (result.affectedRows !== 1) throw ErrorCode.UPDATE_ZERO_FIELD;
    },
    set_price: async (contract_id: number, token_id: number, price: string, conn?: any) => {
        if (!conn) conn = sql;
        let query = `update nfts
                     SET price = ${price}
                     WHERE token_id = ${token_id} and contract_id = ${contract_id}`;
        let [result, ignored] = await conn.query(query);

        // @ts-ignore
        if (result.affectedRows !== 1) throw ErrorCode.UNKNOWN_ERROR;
    },
    update_metadata: async (contract_id: number, token_id: number, data: object, metadata: object) => {
        let conn = await sql.getConnection();
        try {
            await conn.query("START TRANSACTION");
            let query = `update nfts
                     SET metadata = '${JSON.stringify(data).split("'").join("\\'")}'
                     WHERE token_id = ${token_id} and contract_id = ${contract_id}`;
            let [result, ignored] = await conn.query(query);

            // @ts-ignore
            if (result.affectedRows !== 1) throw ErrorCode.UNKNOWN_ERROR;

            await doQuery.insertRow("nft_metadatas", metadata, conn);

            await conn.query("COMMIT");
            conn.release();
        } catch (e) {
            logger.error(e);
            await conn.query("ROLLBACK");
            conn.release();
            throw ErrorCode.UNKNOWN_ERROR;
        }
    },

    update: async (data: any, conn: any) => {
        return doQuery.updateRow("nfts", data, data.id, conn);
    },
};
