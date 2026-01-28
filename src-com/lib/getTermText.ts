import {ISearchTerm} from "../db";
import {findLongest} from "./findLongest";

export function getTermText(oldText: string, term: ISearchTerm): string {
	const token = findLongest(term.tokens);
	const {index} = oldText.match(new RegExp(`(${token})`, 'i'));
	if (index < 0) {
		oldText += term.text;
	} else {
		oldText = oldText.slice(0, index) + term.text + oldText.slice(index + token.length);
	}
	return oldText;
}
