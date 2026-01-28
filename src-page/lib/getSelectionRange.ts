import {IChangeRange} from "../type";

export function getSelectionRange(el: Element): IChangeRange | null {
	if (
		el instanceof HTMLInputElement ||
		el instanceof HTMLTextAreaElement
	) {
		// 部分 input 类型不支持 selection
		if (typeof el.selectionStart === "number" && typeof el.selectionEnd === "number") {
			return {
				start: el.selectionStart,
				end: el.selectionEnd,
			};
		}
		return null;
	}

	// contenteditable
	if (el instanceof HTMLElement && el.isContentEditable) {
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0) return null;

		const range = sel.getRangeAt(0);
		if (!el.contains(range.startContainer) || !el.contains(range.endContainer)) {
			return null;
		}

		const preRange = range.cloneRange();
		preRange.selectNodeContents(el);
		preRange.setEnd(range.startContainer, range.startOffset);

		const start = preRange.toString().length;
		const end = start + range.toString().length;

		return { start, end };
	}

	return null;
}
