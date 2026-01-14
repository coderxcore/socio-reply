import {Api} from "../Api";
import {getInputValue} from "./getInputValue";

export async function sendStatus(el?: HTMLElement) {
	const currentInput = getInputValue(el);
	await Api.contentToBg.setInputStatus({
		currentInput,
		mainContent: "",
		title: document.title,
		url: document.location.href.replace(/^[^/]+\/\/|\?.*$/g, ""),
		writable: !!el
	})
}
