import {IPoint} from "../type";

export function getCaretPoint(el: HTMLElement):IPoint {
	if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
		const start = el.selectionStart ?? 0;

		const div = document.createElement("div");
		const style = getComputedStyle(el);

		for (const k of style) {
			div.style.setProperty(k, style.getPropertyValue(k));
		}

		div.style.position = "absolute";
		div.style.visibility = "hidden";
		div.style.whiteSpace = "pre-wrap";
		div.style.wordWrap = "break-word";
		div.style.overflow = "hidden";
		div.style.width = el.offsetWidth + "px";

		div.textContent = el.value.substring(0, start);

		const span = document.createElement("span");
		span.textContent = el.value.substring(start) || ".";
		div.appendChild(span);

		document.body.appendChild(div);

		const rect = span.getBoundingClientRect();
		const pageX = rect.left + window.scrollX;
		const pageY = rect.top + window.scrollY;

		document.body.removeChild(div);

		return { x: pageX, y: pageY };
	}

	const sel = window.getSelection();
	if (!sel || sel.rangeCount === 0) return { x: 0, y: 0 };

	const range = sel.getRangeAt(0).cloneRange();
	range.collapse(true);

	let rect = range.getClientRects()[0];
	if (!rect) {
		// 光标在空行等特殊情况，插入零宽字符兜底
		const span = document.createElement("span");
		span.textContent = "\u200b";
		range.insertNode(span);
		rect = span.getBoundingClientRect();
		span.parentNode?.removeChild(span);
	}

	return {
		x: rect.left + window.scrollX,
		y: rect.top + window.scrollY,
	};
}
