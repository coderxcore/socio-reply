import {IResult} from "gs-search";
import {Db} from "../db";
import {findLongest, ISearchTerm} from "/src-com";

const maxLength = 18;

export async function queryTermBySearch(results: IResult[], text: string): Promise<ISearchTerm[]> {
	return await Db.term.batchRead(async (store) => {
		const terms: ISearchTerm[] = [];
		for (const result of results) {
			const term = await store.get(result.id);
			if (
				!term
				|| term.text == result.tokens[0]
				|| text.includes(term.text)
			) {
				continue;
			}
			if (term.text < 3) {
				const token = findLongest(result.tokens);
				if (!text.endsWith(token)) {
					continue;
				}
			}
			terms.push({
				...result,
				text: term.text,
			});
			if (terms.length > 6) break;
		}
		return terms;
	})
}
