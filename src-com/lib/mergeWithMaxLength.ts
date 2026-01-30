export function mergeWithMaxLength<T>(
	lists: T[][],
	maxLen: number,
): T[] {
	if (maxLen <= 0 || lists.length === 0) return [];

	// 有数据的数组
	const nonEmpty = lists.map(l => l.length > 0);
	const nonEmptyCount = nonEmpty.filter(Boolean).length;

	if (nonEmptyCount > maxLen) {
		throw new Error('lists 中非空数组数量不能大于 maxLen');
	}

	const lengths = lists.map(l => l.length);
	const total = lengths.reduce((a, b) => a + b, 0);

	if (total <= maxLen) {
		return lists.flat();
	}

	// 每个非空数组先分配 1
	const alloc = lengths.map(len => (len > 0 ? 1 : 0));
	let remain = maxLen - nonEmptyCount;

	// 剩余部分按比例分配
	const weighted = lengths.map((len, i) => ({
		i,
		len,
		weight: len / total,
	}));

	for (const w of weighted) {
		if (remain <= 0) break;
		if (w.len <= alloc[w.i]) continue;

		const add = Math.min(
			w.len - alloc[w.i],
			Math.floor(w.weight * remain),
		);

		alloc[w.i] += add;
		remain -= add;
	}

	// 尾数补齐（按原长度从大到小）
	const order = weighted
		.sort((a, b) => b.len - a.len)
		.map(o => o.i);

	let p = 0;
	while (remain > 0) {
		const i = order[p % order.length];
		if (alloc[i] < lengths[i]) {
			alloc[i]++;
			remain--;
		}
		p++;
	}

	return lists.flatMap((list, i) => list.slice(0, alloc[i]));
}
