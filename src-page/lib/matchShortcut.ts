export function matchShortcut(
	e: KeyboardEvent,
	desc?: string,
	allowModifierAsMain = false
): string | undefined {
	const rawKey = e.key;
	const isModKey = isModifierKey(rawKey);

	// ========= 1. 非修饰键单键（最快路径） =========
	if (!isModKey && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
		if (!desc) return rawKey;
		if (rawKey === desc) return desc;
		return normalizeKey(rawKey) === normalizeKey(desc)
			? desc
			: undefined;
	}

	// ========= 2. 仅修饰键 =========
	if (isModKey && !allowModifierAsMain) {
		// 不允许修饰键作为主键
		return undefined;
	}

	// ========= 3. 组合键或允许的修饰键主键 =========
	const parts: string[] = [];

	if (e.ctrlKey) parts.push('Ctrl');
	if (e.altKey) parts.push('Alt');
	if (e.shiftKey) parts.push('Shift');
	if (e.metaKey) parts.push('Meta');

	const mainKey = normalizeKey(rawKey);

	if (!isModKey || allowModifierAsMain) {
		if (!parts.includes(mainKey)) {
			parts.push(mainKey);
		}
	}

	const current = parts.join('+');

	if (!desc) return current;

	return normalize(desc) === normalize(current) ? desc : undefined;
}

function isModifierKey(k: string): boolean {
	return (
		k === 'Shift' ||
		k === 'Control' ||
		k === 'Alt' ||
		k === 'Meta'
	);
}

function normalize(s: string): string {
	return s
		.split('+')
		.map(normalizeKey)
		.sort()
		.join('+');
}

function normalizeKey(k: string): string {
	switch (k.toLowerCase()) {
		case 'control':
		case 'ctrl':
			return 'Ctrl';
		case 'shift':
			return 'Shift';
		case 'alt':
			return 'Alt';
		case 'meta':
		case 'cmd':
		case 'command':
			return 'Meta';
		default:
			return k.length === 1 ? k.toUpperCase() : k;
	}
}
