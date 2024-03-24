import { doQuery, sql } from "../databases";
import { NftMetadataStatus } from "../utils";

export const NftMetadataModel = {
    list: async () => {
        let query: string = `select  name, description, image, rare as level, multiplier, value
                            from nft_metadatas
                            order by rare asc`;
        let [result, ignored]: any[] = await sql.query(query);
        return result;
    },
    get_random_nft_metadatas: async () => {
        const query = ` select id, name, image, description
                        from nft_metadatas 
                        where status = ${NftMetadataStatus.AVAILABLE}
                        order by rand() 
                        limit 1`;
        const [result] = await sql.query(query, []);
        return result.length ? result[0] : null;
    },

    update: async (data: any, conn?: any) => {
        return doQuery.updateRow("nft_metadatas", data, data.id, conn);
    },

    get_by_rare: async (rare: number) => {
        const query = ` select *
                        from nft_metadatas
                        where rare = ?`;
        const [result] = await sql.query(query, [rare]);
        return result.length ? result[0] : null;
    },
};
