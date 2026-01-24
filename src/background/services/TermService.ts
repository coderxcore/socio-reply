import {setMsgMethod} from "gs-br-ext";
import {ITermService, ISearchTerm} from "/src-com";
import {queryTermBySearch} from "../repo/queryTermBySearch";
import {searchTerm} from "../search/searchTerm";
import {searchSymbol} from "../search/searchSymbol";

setMsgMethod<ITermService>({
	async searchTerm(text: string): Promise<ISearchTerm[]> {
		const emoji = searchSymbol(text);
		const texts = await queryTermBySearch(await searchTerm(text), text);
		return [...emoji.slice(0, 5), ...texts]
	}
});
