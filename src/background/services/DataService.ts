import {setMsgMethod} from "gs-br-ext";
import {IDataService} from "/src-com";
import {FileData} from "../data";
import {searchTerm} from "../search/searchTerm";
import {searchMsg} from "../search/searchMsg";

setMsgMethod<IDataService>({
	async getEmojiCategories(): Promise<Record<string, string[]>> {
		return FileData.emojiCategories;
	},
	async preload(): Promise<void> {
		await searchTerm('笑')
		await searchMsg({text: '笑'})
	},
});
