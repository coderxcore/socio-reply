import {IndexStatus} from "./IndexStatus";

export async function checkIndexStatus() {
	const start = await IndexStatus.getStart();
	if (!start) {
		return
	}
	console.log('开始更新索引', start)
}
