const Regex = /placeholder/i

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

function getContentEditableValue(el: HTMLElement & any) {
	el = el.cloneNode(true);
	for (const c of el.querySelectorAll('*') as HTMLElement[]) {
		if (Regex.test(c.className) || c.getAttributeNames().some(n => Regex.test(n))) {
			c.remove();
			console.log(c)
		}
	}
	return el.innerText;
}
