import {getLexicon, LexiconItem} from "./getLexicon";
import {getEmoji, getEmojiCategories} from "./getEmoji";


export class FileData {

	static emojisDict = getEmoji
	static #lexicon?: LexiconItem[];
	static #emojiCategories?: Record<string, string[]>

	static get emojiCategories(): Record<string, string[]> {
		return this.#emojiCategories || (this.#emojiCategories = getEmojiCategories());
	}

	static async lexicon() {
		if (this.#lexicon) {
			return this.#lexicon;
		}
		return this.#lexicon = getLexicon();
	}

}
