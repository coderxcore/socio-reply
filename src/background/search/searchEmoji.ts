import {ISearchTerm} from "../../../src-com";
import {FileData} from "../data";

let lastCharMap: Map<number, string[]> | undefined;
let descEmojiMap: Map<string, string[]> | undefined;

export function searchEmoji(query: string): ISearchTerm[] {
	if (!query || !query.length) {
		return [];
	}
	checkAndInitMap();
	const lastCode = query.charCodeAt(query.length - 1);
	if (!lastCharMap.has(lastCode)) {
		return [];
	}
	const descArr = lastCharMap.get(lastCode)!;
	const result = descArr.filter(desc => query.endsWith(desc));
	return result.map(desc => descEmojiMap.get(desc)!).map(text => ({text})) as any;
}

function checkAndInitMap() {
	if (lastCharMap) {
		return;
	}
	lastCharMap = new Map();
	descEmojiMap = new Map();
	const dict = FileData.emojisDict()
	for (let i = 0; i < dict.length; i++) {
		const [emoji, descriptions] = dict[i];
		for (let j = 0; j < descriptions.length; j++) {
			const desc = descriptions[j].toLowerCase();

			const emojiArr = descEmojiMap.get(desc) || [];
			if (!emojiArr.includes(emoji)) {
				emojiArr.push(emoji);
			}
			descEmojiMap.set(desc, emojiArr);

			const lastChar = desc.charCodeAt(desc.length - 1);
			const discArr = lastCharMap.get(lastChar) || [];
			if (!discArr.includes(desc)) {
				discArr.push(desc);
			}
			lastCharMap.set(lastChar, discArr);
		}
		for (const arr of lastCharMap.values()) {
			arr.sort((a, b) => b.length - a.length);
		}
	}
}
