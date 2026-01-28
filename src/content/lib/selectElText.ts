export function selectElText(el: HTMLElement): void {
	el.focus();
	const selection = window.getSelection();
	const range = document.createRange();
	range.selectNodeContents(el);
	selection.removeAllRanges();
	selection.addRange(range);
}
