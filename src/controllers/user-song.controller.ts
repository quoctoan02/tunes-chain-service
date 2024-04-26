import {UserSongModel} from "../models/user-song.model";
import {NftModel} from "../models";

export class UserSongController {
    public static async buy(data: any, conn?: any) {
        const songNft = await NftModel.get_by_token_id(4, data.songId)
        if(songNft && songNft.status === 1 && songNft.metadata.song_id) return await UserSongModel.create({song_id: songNft.metadata.song_id, user_id: data.userId}, conn)
    }

    public static async list(data: any) {

    }

    public static async fname() {

    }
}
