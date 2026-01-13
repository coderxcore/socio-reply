import {getLexicon, LexiconItem} from "./getLexicon";
import {getEmoji, getEmojiCategories} from "./getEmoji";


export class FileData {

	static #lexicon?: LexiconItem[];
	static #emojis?: [string, string[]][];
	static #emojiCategories?: Record<string, string[]>;


	static async lexicon() {
		if (this.#lexicon) {
			return this.#lexicon;
		}
		return this.#lexicon = getLexicon();
	}

	static async emojis() {
		if (this.#emojis) {
			return this.#emojis;
		}
		return this.#emojis = getEmoji();
	}

	static async emojiCategories() {
		if (this.#emojiCategories) {
			return this.#emojiCategories;
		}
		return this.#emojiCategories = getEmojiCategories();
	}

}
