import {ContentStore as cs} from "../ui/store";
import {getInputValue} from "../lib/getInputValue";
import {readInput} from "./readInput";
import {ContextVars} from "./contextVars";
import {AutoMode} from "../type";

const arrowReg = /^(Arrow|Backspace)/i
let eventAdded = false, lastCode: string, lastTime: number;

const idMap = new WeakMap<Element, number>()

export function listenInput(inputEl?: HTMLElement) {
	if (!inputEl) {
		if (lastCode !== 'Tab' || cs.pageContext.autoMode === 2) {
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
	document.body.addEventListener("blur", onBlur, true);
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
	document.body.removeEventListener("blur", onBlur, true);

	window.removeEventListener('resize', onInput, true);
}

function onBlur(e: FocusEvent) {
	// if(e.relatedTarget!==cs.pageContext.r)
	console.log(e)
}

function compositionstart() {
	ContextVars.composing = true;
}


async function compositionend() {
	ContextVars.composing = false;
	await readInput();
}

async function onInput() {
	if (!ContextVars.composing) await readInput()
}

function onkeydown(e: KeyboardEvent) {
	if (e.code === 'Tab' && (cs.settings.lockAutoKey || cs.pageContext.autoMode != 2)) {
		e.stopPropagation();
		e.preventDefault();
	}
}

function onkeyup(e: KeyboardEvent) {
	const {pageContext: cxt} = cs;
	if (e.code === 'Tab') {
		if (lastCode === 'Tab' && Date.now() - lastTime <= cs.settings.keyDoubleDelay) {
			cxt.changeAutoMode(AutoMode.Msg);
		} else {
			cxt.changeAutoMode(AutoMode.Term);
		}
	} else {
		cxt.changeAutoMode(AutoMode.Off);
		if (!ContextVars.lastValue || ContextVars.lastValue.length < 3 || arrowReg.test(e.code)) {
			onInput().catch(console.warn);
		}
	}
	// else {
	// 	console.log(lastValue, e.code)
	// }
	lastCode = e.code;
	lastTime = Date.now();
}
