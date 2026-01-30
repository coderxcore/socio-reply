import {ISearchTerm} from "../db";
import {findLongest} from "./findLongest";

export function getTermText(oldText: string, term: ISearchTerm): string {
	const token = findLongest(term.tokens);
	const re = new RegExp(`(${token})`, 'ig');
	const matches = [...oldText.matchAll(re)];
	const {index} = matches.at(-1) || {};
	if (isNaN(index) || index < 0) {
		oldText = oldText + term.text;
	} else {
		oldText = oldText.slice(0, index) + term.text + oldText.slice(index + token.length);
	}
	return oldText;
}
