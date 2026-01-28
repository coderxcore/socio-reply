import {IPoint} from "../type";

export function getCaretPoint(el: HTMLElement): IPoint {
	if (!("selectionStart" in el)) {
		const sel = window.getSelection();
		if (!sel || !sel.rangeCount) return {x: 0, y: 0};

		const range = sel.getRangeAt(0).cloneRange();
		range.collapse(true);

		let rect = range.getClientRects()[0];
		if (!rect) {
			const span = document.createElement("span");
			span.textContent = "\u200b";
			range.insertNode(span);
			rect = span.getBoundingClientRect();
			span.remove();
		}

		return {
			x: rect.left + window.scrollX,
			y: rect.top + window.scrollY,
		};
	}

	const input = el as HTMLInputElement | HTMLTextAreaElement;
	const pos = input.selectionStart ?? 0;

	const div = document.createElement("div");
	const style = getComputedStyle(input);

	const copyProps = [
		"font", "fontSize", "fontFamily", "fontWeight",
		"letterSpacing", "textTransform", "wordSpacing",
		"textIndent", "whiteSpace", "lineHeight",
		"padding", "border", "boxSizing",
		"overflowWrap", "wordBreak",
	];

	copyProps.forEach(p => {
		div.style[p as any] = style[p as any];
	});

	div.style.position = "absolute";
	div.style.visibility = "hidden";
	div.style.whiteSpace = "pre-wrap";
	div.style.wordWrap = "break-word";
	div.style.top = "0";
	div.style.left = "0";
	div.style.width = input.offsetWidth + "px";

	const before = input.value.substring(0, pos);
	const after = input.value.substring(pos) || ".";

	div.textContent = before;

	const span = document.createElement("span");
	span.textContent = after[0];
	div.appendChild(span);

	document.body.appendChild(div);

	const spanRect = span.getBoundingClientRect();
	const inputRect = input.getBoundingClientRect();

	const x =
		inputRect.left +
		spanRect.left -
		div.getBoundingClientRect().left -
		input.scrollLeft +
		window.scrollX;

	const y =
		inputRect.top +
		spanRect.top -
		div.getBoundingClientRect().top -
		input.scrollTop +
		window.scrollY;

	div.remove();

	return {x, y};
}
