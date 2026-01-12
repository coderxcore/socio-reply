import {messageLastToken} from "../pre/messageTokens";
import {buildFuzzy} from "../pre/multiLangTokenizer";
import {Search} from "./Search";

export async function searchTerm(text: string) {
	if (!text) return []
	const lastToken = await messageLastToken(text)
	if (!lastToken) return []
	if (text.endsWith(lastToken)) {
		const term = {
			text: lastToken,
			prefix: [lastToken]
		}
		const result = await Search.termPrefix.search(term);
		if (result?.length > 0) {
			return result;
		}
	}
	const term2 = {
		text: lastToken,
		fuzzy: [lastToken, ...buildFuzzy(lastToken, {} as any)],
	}
	return await Search.termFuzzy.search(term2);
}

//todo: 优化首字与模糊结果的合并
