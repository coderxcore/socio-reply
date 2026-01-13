import {getLexicon, LexiconItem} from "./getLexicon";
import {getEmoji, getEmojiCategories} from "./getEmoji";


export class FileData {

	static #lexicon?: LexiconItem[];

	static async lexicon() {
		if (this.#lexicon) {
			return this.#lexicon;
		}
		return this.#lexicon = getLexicon();
	}

	static emojisDict = getEmoji

	static emojiCategories = getEmojiCategories;

}
