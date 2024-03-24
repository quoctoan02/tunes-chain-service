import {doQuery, sql} from "../databases";
import {BalanceHistoryType, ErrorCode, logger, WithdrawalStatus} from "../utils";
import {BalanceModel} from "./balance.model";

export const WithdrawalModel = {
    list: async (data: any = {}) => {
        let query = `select * from withdrawals where 1=1`;
        const fields: any[] = [];
        ['status', 'user_id', 'currency_id'].forEach(item => {
            if (data[item]) {
                query += ` and ${item} = ?`;
                fields.push(data[item]);
            }
        });
        return {
            data: await doQuery.listRows(query, fields, data),
            total: await doQuery.countRows(query, fields)
        }
    },
    get: async (id: number) => {
        const query = `select w.*
                     from withdrawals w
                     WHERE w.id = ${id}`;
        // logger.info("query", query);
        return doQuery.getOne(query);
    },
    withdrawalFailed: async (withdrawal: any) => {
        let conn = await sql.getConnection();
        try {
            await conn.query("START TRANSACTION");

            // update withdrawal status
            const query = `UPDATE withdrawals
                       SET status = ${WithdrawalStatus.FAILED}
                       WHERE id = ${withdrawal.id}
                         and status = ${WithdrawalStatus.REQUESTED};`;
            logger.info("query", query);
            let [result, ignored] = await conn.query(query);
            // @ts-ignore
            if (result.affectedRows == 0)
                throw {stack: 'change withdrawal to failed failed'};

            // update user balance
            await BalanceModel.update_balance({
                user_id: withdrawal.user_id,
                currency_id: withdrawal.currency_id,
                type: BalanceHistoryType.WITHDRAWAL_FAILED,
                balance_change: withdrawal.quantity,
                reason_id: withdrawal.id,
            }, conn);

            await conn.query("COMMIT");
            conn.release();
        } catch (e) {
            console.error(e)
            await conn.query("ROLLBACK");
            conn.release();
            logger.error('Update withdrawal FAILED ERRROR!', e);
            throw ErrorCode.UNKNOWN_ERROR;
        }
    },
    withdrawalDone: async (withdrawal: any) => {
        let conn = await sql.getConnection();
        try {
            await conn.query("START TRANSACTION");

            // update withdrawal status
            const query = `UPDATE withdrawals
                       SET status = ${WithdrawalStatus.DONE}
                       WHERE id = ${withdrawal.id}
                         and status = ${WithdrawalStatus.REQUESTED};`;
            logger.info("query", query);
            let [result, ignored] = await conn.query(query);
            // @ts-ignore
            if (result.affectedRows == 0)
                throw {stack: 'change withdrawal to DONE failed'};
            await conn.query("COMMIT");
            conn.release();
        } catch (e) {
            console.error(e)
            await conn.query("ROLLBACK");
            conn.release();
            logger.error('Update withdrawal DONE ERROR!', e);
            throw ErrorCode.UNKNOWN_ERROR;
        }
    },
}
