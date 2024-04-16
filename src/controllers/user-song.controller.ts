import {UserSongModel} from "../models/song.model";

export class UserSongController {
    public static async buy(data: any) {
        return await UserSongModel.create({song_id: data.songId, user_id: data.userId, price: data.price})
    }

    public static async list(data: any) {

    }

    public static async fname() {

    }
}
