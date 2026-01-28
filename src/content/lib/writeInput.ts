import {selectElText} from "./selectElText";
import {wait} from "gs-base";

const InputRegex = /input|textarea/i

export async function writeInput(el: HTMLElement, text: string) {
	el.focus();
	if (InputRegex.test(el.tagName)) {
		inputWriteText(el as HTMLInputElement | HTMLTextAreaElement, text);
		return
	}
	await editableWrite(el, text);
}

function inputWriteText(el: HTMLInputElement | HTMLTextAreaElement, text: string) {
	el.value = text;
	el.dispatchEvent(new Event("input", {bubbles: true}));
	el.dispatchEvent(new Event("change", {bubbles: true}));
}

async function editableWrite(el: HTMLElement, text: string) {
	selectElText(el)
	await wait(10);
	document.execCommand("delete");
	await wait(10);
	document.execCommand("insertText", false, text);
}
