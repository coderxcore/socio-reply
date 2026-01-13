import {setMsgMethod} from "gs-br-ext";
import {IDataService} from "/src-com";
import {FileData} from "../data";

setMsgMethod<IDataService>({
	async getEmojiCategories(): Promise<Record<string, string[]>> {
		return FileData.emojiCategories;
	}
});
