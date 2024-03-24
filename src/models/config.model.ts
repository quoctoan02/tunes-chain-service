import { doQuery, sql } from "../databases";
import { ConfigKey, ConfigType } from "../utils";

export const ConfigModel = {
    getByKey: async (key: ConfigKey) => {
        return doQuery.getByType("configs", "key", key);
    },

    update_nft_total_supply_config: async (data: any, conn?: any) => {
        if (!conn) conn = sql;
        let query = `update configs
                 SET value = '${data.total_supply}'
                 WHERE type = ${ConfigType.NFT_TOTAL_SUPPLY}`;
        let [result, ignored] = await conn.query(query);

        // @ts-ignore
        // if (result.affectedRows !== 1) throw ErrorCode.UPDATE_ZERO_FIELD;
    },
};
