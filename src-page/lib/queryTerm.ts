import {Api} from "../api";
import {ISearchTerm} from "/src-com";

export async function queryTerm(search: string, fullText: string, start: number, end: number): Promise<ISearchTerm[]> {
	return (await Api.search.searchTerm(search))
		.filter(t => {
			const len = t.text.length;
			const txt = fullText.slice(Math.max(0, start - len), Math.max(end + len, t.text.length));
			return !txt.includes(t.text);
		})
}
