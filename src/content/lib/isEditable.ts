// const searchRegex = /search|password/i;
const notTypeRegex = /button|checkbox|file|hidden|image|radio|reset|submit/i;

export function isEditable(el) {
	if (!el) return false;
	//
	// for (const attr of ['role', 'type', 'name', 'id']) {
	// 	if (searchRegex.test(el.getAttribute(attr))) {
	// 		return false;
	// 	}
	// }

	const tag = el.tagName?.toLowerCase();

	if (tag === "textarea") return true;

	if (tag === "input") {
		return !notTypeRegex.test(el.type);
	}

	// 可编辑元素
	if (el.isContentEditable) return true;

	// 一些自定义输入框（常见于富文本/组件库）
	return el.getAttribute("role") === "textbox";

}
