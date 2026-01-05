import {MultilingualTokenizer, tokenize, LexiconLoader} from "gs-tokenizer";

const tokenizer = new MultilingualTokenizer();
let tokenInit: boolean = false;

export function messageTokens(text: string) {
	let tokens = tokenize(text).filter(t => t.type !== 'space');
	console.log(tokens.map(t => t.txt))
	console.log(toToken(text).filter(t => t.type !== 'space').map(t => t.txt))
	return tokens.map(t => t.txt);
}

function toToken(text: string) {
	if (!tokenInit) {
		// LexiconLoader.getInstance()
		tokenInit = true;
	}
	return tokenizer.tokenize(text);
}

