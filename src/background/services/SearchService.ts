import {setMsgMethod} from "gs-br-ext";
import {ISearchMessage, ISearchService, ISearchTerm} from "/src-com";
import {queryTermBySearch} from "../repo/queryTermBySearch";
import {queryMessageBySearch} from "../repo/queryMessageBySearch";
import {searchMsg} from "../search/searchMsg";
import {searchTerm} from "../search/searchTerm";
import {searchEmoji} from "../search/searchEmoji";

setMsgMethod<ISearchService>({
	async searchMsg(text: string): Promise<ISearchMessage[]> {
		return await queryMessageBySearch(await searchMsg(text),text);
	},
	async searchTerm(text: string): Promise<ISearchTerm[]> {
		const emoji = searchEmoji(text);
		const texts = await queryTermBySearch(await searchTerm(text), text);
		return [...emoji.slice(0, 5), ...texts]
	}

});
