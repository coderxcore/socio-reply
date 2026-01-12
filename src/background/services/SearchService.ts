import {setMsgMethod} from "gs-br-ext";
import {ISearchedMessage, ISearchService, ISearchTerm} from "/src-com";
import {queryTermBySearch} from "../repo/queryTermBySearch";
import {queryMessageBySearch} from "../repo/queryMessageBySearch";
import {searchMsg} from "../search/searchMsg";
import {searchTerm} from "../search/searchTerm";

setMsgMethod<ISearchService>({
	async searchMsg(text: string): Promise<ISearchedMessage[]> {
		return await queryMessageBySearch(await searchMsg(text));
	},
	async searchTerm(text: string): Promise<ISearchTerm[]> {
		return await queryTermBySearch(await searchTerm(text),text);
	}

});
