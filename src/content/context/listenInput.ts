import {ContentStore as cs} from "../ui/store";
import {getInputValue} from "../lib/getInputValue";
import {readInput} from "./readInput";

const arrowReg = /^(Arrow|Backspace)/i
let composing = false, eventAdded = false, lastValue: string, lastCode: string, lastTime: number;

const idMap = new WeakMap<Element, number>()

export function listenInput(inputEl?: HTMLElement) {
	if (!inputEl) {
		if (lastCode !== 'Tab' || cs.pageContext.tabStatus === 2) {
			removeInputListeners();
		}
		return;
	}
	const {pageContext: cxt} = cs;
	if (cxt.inputItem?.el !== inputEl) {
		let id = idMap.get(inputEl);
		if (!id) {
			id = Date.now() + Math.floor(Date.now() / 1000)
			idMap.set(inputEl, id);
		}
		cxt.inputItem = {id, el: inputEl, text: getInputValue(inputEl) || ''};
	}
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
	document.body.addEventListener("keydown", onkeydown, true);
	window.addEventListener('resize', onInput, true);
}

function removeInputListeners() {
	if (!eventAdded) return;
	eventAdded = false;
	document.body.removeEventListener("compositionstart", compositionstart, true);
	document.body.removeEventListener("compositionend", compositionend, true);
	document.body.removeEventListener("input", onInput, true);
	document.body.removeEventListener("click", onInput, true);
	document.body.removeEventListener("keyup", onkeyup, true);
	document.body.removeEventListener("onkeydown", onkeydown, true);
	window.removeEventListener('resize', onInput, true);
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

function onkeydown(e: KeyboardEvent) {
	if (e.code === 'Tab' && (cs.settings.lockTab || cs.pageContext.tabStatus != 2)) {
		e.stopPropagation();
		e.preventDefault();
	}
}

function onkeyup(e: KeyboardEvent) {
	if (e.code === 'Tab') {
		if (lastCode === 'Tab' && Date.now() - lastTime <= cs.settings.tabDoubleDelay) {
			cs.pageContext.tabStatus = 2;
		} else {
			cs.pageContext.tabStatus = 1;
		}
		cs.pageContext.tabTime = Date.now();
	} else {
		cs.pageContext.tabStatus = undefined;
		if (!lastValue || lastValue.length < 3 || arrowReg.test(e.code)) {
			onInput().catch(console.warn);
		}
	}
	// else {
	// 	console.log(lastValue, e.code)
	// }
	lastCode = e.code;
	lastTime = Date.now();
}
