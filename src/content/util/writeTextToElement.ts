/**
 * 向指定输入元素安全写入文本，并完整触发原页面事件逻辑
 * 兼容：input / textarea / contenteditable / role="textbox"
 */
export function writeTextToElement(el: HTMLElement, text: string): boolean {
	if (!el) return false;

	// 输入法合成中禁止写入
	if ((window as any).__IME_COMPOSING__) return false;

	el.focus();

	const tag = el.tagName.toLowerCase();

	if (tag === "input" || tag === "textarea") {
		writeToInput(el as HTMLInputElement | HTMLTextAreaElement, text);
		return true;
	}

	if (el.isContentEditable || el.getAttribute("role") === "textbox") {
		writeToContentEditable(el, text);
		return true;
	}

	return false;
}

/* ===== 内部实现 ===== */

function writeToInput(
	el: HTMLInputElement | HTMLTextAreaElement,
	text: string
) {
	const start = el.selectionStart ?? el.value.length;
	const end   = el.selectionEnd   ?? el.value.length;

	const newValue =
		el.value.slice(0, start) +
		text +
		el.value.slice(end);

	el.value = newValue;

	const pos = start + text.length;
	el.setSelectionRange(pos, pos);

	el.dispatchEvent(new Event("input",  { bubbles: true }));
	el.dispatchEvent(new Event("change", { bubbles: true }));
}

function writeToContentEditable(el: HTMLElement, text: string) {
	const sel = window.getSelection();
	if (!sel || !sel.rangeCount) return;

	const range = sel.getRangeAt(0);
	range.deleteContents();

	const node = document.createTextNode(text);
	range.insertNode(node);

	// 光标移动到插入文本之后
	range.setStartAfter(node);
	range.setEndAfter(node);
	sel.removeAllRanges();
	sel.addRange(range);

	el.dispatchEvent(new Event("input", { bubbles: true }));
}

/* ===== 输入法保护（建议全局只注册一次）===== */

if (!(window as any).__IME_LISTENER_INSTALLED__) {
	(window as any).__IME_LISTENER_INSTALLED__ = true;
	(window as any).__IME_COMPOSING__ = false;

	document.addEventListener("compositionstart", () => {
		(window as any).__IME_COMPOSING__ = true;
	});

	document.addEventListener("compositionend", () => {
		(window as any).__IME_COMPOSING__ = false;
	});
}
