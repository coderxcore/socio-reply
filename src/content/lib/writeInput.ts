import {getInputValue} from "./getInputValue";
import {selectElText} from "./selectElText";
import {wait} from "gs-base";

const InputRegex = /input|textarea/i

export async function writeInput(el: HTMLElement, text: string) {
	el.focus();
	if (InputRegex.test(el.tagName)) {
		console.log(text)
		inputWriteText(el as HTMLInputElement | HTMLTextAreaElement, text);
		if (getInputValue(el) === text) {
			return
		}
	}
	await editableWrite(el, text);
}

function inputWriteText(el: HTMLInputElement | HTMLTextAreaElement, text: string) {
	el.value = text;
	el.dispatchEvent(new Event("input", {bubbles: true}));
	el.dispatchEvent(new Event("change", {bubbles: true}));
}

async function editableWrite(el: HTMLElement, text: string) {
	el.focus();
	selectElText(el)
	document.execCommand('delete')


	el.dispatchEvent(
		new CompositionEvent('compositionstart', {
			bubbles: true,
			data: '',
		})
	);

	await wait(10)
	el.dispatchEvent(
		new CompositionEvent('compositionupdate', {
			bubbles: true,
			data: text,
		})
	);
	document.execCommand('insertText', false, text);

	await wait(10)
	el.dispatchEvent(
		new CompositionEvent('compositionend', {
			bubbles: true,
			data: text,
		})
	);

	el.dispatchEvent(
		new InputEvent('input', {
			bubbles: true,
			data: text,
			inputType: 'insertCompositionText',
		})
	);
}

