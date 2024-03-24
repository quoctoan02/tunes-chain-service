import {UserModel} from "../models";
import {ErrorCode} from "../utils";


export class UserController {
    public static async getByEmail(email: string) {
        return UserModel.getByType('email', email);
    };

    public static async get(userId: number) {
        const user: any = await UserModel.get(userId);
        if (!user)
            throw ErrorCode.USER_NOT_FOUND;
        return user;
    };

    public static async getByAddress(address: string) {
        return UserModel.getByType('address', address);
    }
}
