const searchRegex = /search/i;

export function isEditable(el) {
	if (!el) return false;

	for (const attr of ['role', 'type', 'name', 'id']) {
		if (searchRegex.test(el.getAttribute(attr))) {
			return false;
		}
	}

	const tag = el.tagName?.toLowerCase();

	// 原生表单
	if (tag === "input" || tag === "textarea") return true;

	// 可编辑元素
	if (el.isContentEditable) return true;

	// 一些自定义输入框（常见于富文本/组件库）
	return el.getAttribute("role") === "textbox";

}
