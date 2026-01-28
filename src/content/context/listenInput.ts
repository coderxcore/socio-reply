import {ContentStore as cs} from "../ui/store";
import {getInputValue} from "../lib/getInputValue";
import {readInput} from "./readInput";

const arrowReg = /^(Arrow|Backspace)/i
let composing = false;
let eventAdded = false;
let lastValue: string

const idMap = new WeakMap<Element, number>()

export function listenInput(inputEl?: HTMLElement) {
	if (!inputEl) {
		removeInputListeners();
		return;
	}
	if (cs.pageContext.inputItem?.el === inputEl) return;
	let id = idMap.get(inputEl);
	if (!id) {
		id = Date.now() + Math.floor(Date.now() / 1000)
		idMap.set(inputEl, id);
	}
	cs.pageContext.inputItem = {id, el: inputEl, text: getInputValue(inputEl) || ''};
	addInputListeners()
}

function addInputListeners() {
	if (eventAdded) return;
	eventAdded = true;
	document.body.addEventListener("compositionstart", compositionstart, true);
	document.body.addEventListener("compositionend", compositionend, true);
	document.body.addEventListener("input", onInput, true);
	document.body.addEventListener("click", onInput, true);
	document.body.addEventListener("keyup", onkeyup, true);
	window.addEventListener('resize', onInput, true);
}

function removeInputListeners() {
	if (!eventAdded) return;
	eventAdded = false;
	document.body.removeEventListener("compositionstart", compositionstart);
	document.body.removeEventListener("compositionend", compositionend);
	document.body.removeEventListener("input", onInput);
	document.body.removeEventListener("click", onInput);
	document.body.removeEventListener("keyup", onkeyup);
	window.removeEventListener('resize', onInput);
}

function compositionstart() {
	composing = true;
}


async function compositionend() {
	composing = false;
	lastValue = await readInput();
}

async function onInput() {
	if (!composing) lastValue = await readInput()
}

function onkeyup(e: KeyboardEvent) {
	if (e.code === 'Tab') {
		console.log('完成')
		setTimeout(() => console.log(cs.pageContext.el), 100);
	} else if (!lastValue || lastValue.length < 3 || arrowReg.test(e.code)) {
		onInput().catch(console.warn);
	}
	// else {
	// 	console.log(lastValue, e.code)
	// }
}
