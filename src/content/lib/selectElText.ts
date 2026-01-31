export function selectElText(el: HTMLElement): Range {
	el.focus();
	const selection = window.getSelection();
	const range = document.createRange();
	range.selectNodeContents(el);
	selection.removeAllRanges();
	selection.addRange(range);
	return range;
}
