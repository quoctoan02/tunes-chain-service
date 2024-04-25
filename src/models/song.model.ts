import {doQuery, sql} from "../databases";
import {SongStatus, Utils} from "../utils";

const table = `songs`;

export const SongModel = {
    create: async (data: any, conn?: any) => {
        return doQuery.insertRow(table, data, conn);
    },

    getByType: async (type: string, value: any) => {
        return doQuery.getByType(table, type, value);
    },
    getSongIdByArtistAddress: async (address: string) => {
        let query = `select s.*, owner.address owner_address
                            from songs s
                                     join(select ar.*, al.id album_id
                                          from artists ar
                                                   join albums al on ar.id = al.artist_id) owner on owner.album_id = s.album_id
                            where owner.address = ?
                            and s.status = ${SongStatus.ACTIVATED}
                            limit 1`
        const [result] = await sql.query(query, [address])
        return result[0]
    },
    update: async (data: any, conn?: any) => {
        return doQuery.updateRow(table, data, data.id, conn);
    },

    get: async (id: number) => {
        return doQuery.getById(table, id);
    },

    list: async (data: any) => {
        let query = ` select * from ${table} where 1 = 1 `;
        const fields: any[] = [];
        [''].forEach(value => {
            if (data[value]) {
                query += ` and lower(${value}) = lower(?)`;
                fields.push(data[value])
            }
        })
        return {
            data: await doQuery.listRows(query, fields, data),
            total: await doQuery.countRows(query, fields)
        }
    },
}
