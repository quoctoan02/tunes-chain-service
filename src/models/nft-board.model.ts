import { doQuery, sql } from "../databases";
import { NftBoardStatus } from "../utils";

const table = `nft_boards`;

export const NftBoardModel = {
    create: async (data: any, conn?: any) => {
        return doQuery.insertRow(table, data, conn);
    },

    getByType: async (type: string, value: any) => {
        return doQuery.getByType(table, type, value);
    },

    update: async (data: any, conn?: any) => {
        return doQuery.updateRow(table, data, data.id, conn);
    },

    get: async (id: number) => {
        return doQuery.getById(table, id);
    },

    getByNftId: async (nft_id: number) => {
        const query = ` select *
                        from ${table}
                        where nft_id = ?`;
        const [result] = await sql.query(query, [nft_id]);
        return result.length ? result[0] : null;
    },

    getByLevelAndUserId: async (level: number, user_id: number) => {
        const query = ` select *
                        from ${table}
                        where level = ?, user_id = ?`;
        const [result] = await sql.query(query, [level, user_id]);
        return result.length ? result[0] : null;
    },

    list_board: async (user_id: number) => {
        const query = ` select nb.*, n.token_id, n.metadata as nft_metadata, nc.address as collection_address
                        from ${table} nb
                        join nfts n
                        on nb.nft_id = n.id
                        inner join contracts nc on n.contract_id = nc.id
                        where nb.user_id = ? and nb.status = ${NftBoardStatus.ADDED}
                        order by level asc`;
        const [result] = await sql.query(query, [user_id]);
        return result;
    },

    list: async (data: any) => {
        let query = ` select * from ${table} where 1 = 1 `;
        const fields: any[] = [];
        [""].forEach((value) => {
            if (data[value]) {
                query += ` lower(${value}) = lower(?)`;
                fields.push(data[value]);
            }
        });
        return {
            data: await doQuery.listRows(query, fields, data),
            total: await doQuery.countRows(query, fields),
        };
    },
};
