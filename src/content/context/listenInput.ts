import {ContentStore as cs} from "../store";
import {getInputValue} from "../lib/getInputValue";
import {readInput} from "./readInput";
import {ContextVars, rootEl} from "./contextVars";
import {AutoMode} from "../type";
import {matchShortcut} from "/src-page/lib/matchShortcut";

const arrowReg = /^(Arrow|Backspace)/i
let eventAdded = false, lastCode: string

const idMap = new WeakMap<Element, number>()

export async function listenInput(inputEl?: HTMLElement) {
	if (!inputEl) {
		removeInputListeners();
		return;
	}
	const {pageContext: cxt} = cs;
	if (cxt.inputItem?.el !== inputEl) {
		let id = idMap.get(inputEl);
		if (!id) {
			id = Date.now() + Math.floor(Date.now() / 1000)
			idMap.set(inputEl, id);
		}
		cxt.setInputItem({id, el: inputEl, text: getInputValue(inputEl) || ''})
	} else {
		cxt.active = true;
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
	document.body.addEventListener("keydown", onSelectBeginKeydown, true);
	document.body.addEventListener("blur", onBlur, true);
	document.addEventListener("keyup", onkeyup, true);
	window.addEventListener('resize', onresize, true);
}

function removeInputListeners() {
	if (!eventAdded) return;
	eventAdded = false;
	document.body.removeEventListener("compositionstart", compositionstart, true);
	document.body.removeEventListener("compositionend", compositionend, true);
	document.body.removeEventListener("input", onInput, true);
	document.body.removeEventListener("click", onInput, true);
	document.body.removeEventListener("keydown", onSelectBeginKeydown, true);
	document.body.removeEventListener("blur", onBlur, true);
	document.removeEventListener("keyup", onkeyup, true);
	window.removeEventListener('resize', onresize, true);
}

function onresize() {
	cs.pageContext.locationChangeTime = Date.now();
}

function onBlur(e: FocusEvent) {
	if (e.target === cs.pageContext.el && e.relatedTarget !== rootEl) {
		if (cs.pageContext.hasWork && ContextVars.termHover) {
			return
		}
		cs.pageContext.active = false
		ContextVars.lastListenEl = undefined;
	}
}

function compositionstart() {
	ContextVars.composing = true;
}

async function compositionend(e: CompositionEvent) {
	ContextVars.composing = false;
	await readInput(e.target);
}

async function onInput(e: Event) {
	if (!ContextVars.composing) await readInput(e.target)
}

export function onSelectBeginKeydown(e: KeyboardEvent) {
	if (!cs.pageContext.hasWork) {
		return;
	}
	const s = cs.settings;
	if (
		matchShortcut(e, s.selectBeginKey)
		|| matchShortcut(e, s.selectBeginKey2)
		|| matchShortcut(e, s.deactivateKey)
	) {
		e.stopPropagation();
		e.preventDefault();
	}
}

function onkeyup(e: KeyboardEvent) {
	const s = cs.settings;
	const {pageContext: cxt} = cs;
	if (matchShortcut(e, s.selectBeginKey)) {
		cxt.changeAutoMode(AutoMode.Term);
	} else if (matchShortcut(e, s.selectBeginKey2)) {
		cxt.changeAutoMode(AutoMode.Msg);
	} else if (matchShortcut(e, s.deactivateKey)) {
		cxt.active = false;
	} else {
		// console.log(e.code)
		cxt.changeAutoMode(AutoMode.Off);
		if (!ContextVars.lastValue || ContextVars.lastValue.length < 3 || arrowReg.test(e.code)) {
			onInput(e).catch(console.warn);
		}
	}
	lastCode = e.code;
}
