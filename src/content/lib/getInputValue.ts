export function getInputValue(el: HTMLElement & any) {
	if (!el) return null;
	if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
		return el.value;
	}
	if (el.isContentEditable) {
		return getContentEditableValue(el);
	}
	if (el.getAttribute("role") === "textbox") {
		return el.textContent;
	}
	return '';
}

function getContentEditableValue(el) {
	// 保留用户可见文本
	return el.innerText;
	// 如果你要原始结构：
	// return el.innerHTML;
}
