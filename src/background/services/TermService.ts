import {setMsgMethod} from "gs-br-ext";
import {ITermService, ISearchTerm} from "/src-com";
import {queryTermBySearch} from "../repo/queryTermBySearch";
import {searchTerm} from "../search/searchTerm";
import {searchSymbol} from "../search/searchSymbol";
import {mergeWithMaxLength} from "/src-com/lib/mergeWithMaxLength";

const maxTermNum = 9;

setMsgMethod<ITermService>({
	async searchTerm(text: string): Promise<ISearchTerm[]> {
		const emoji = searchSymbol(text);
		const texts = await queryTermBySearch(await searchTerm(text), text);
		texts.sort((a, b) => {
			const r = b.text.length - a.text.length;
			if (r === 0) {
				return a.score - b.score;
			}
			return r;
		});
		return mergeWithMaxLength([texts, emoji], maxTermNum);
	}
});
