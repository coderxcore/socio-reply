import {Timer} from "gs-base";

import {ContentStore as cs} from "../store";
import {getInputValue} from "../util/getInputValue";

const timer = new Timer(200);
let composing = false;
let eventAdded = false;

const idMap = new WeakMap<Element, number>()

export function startListenerInput(inputEl?: HTMLElement) {
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
	cs.pageContext.inputItem = {id, el: inputEl};
	addInputListeners()
}

function addInputListeners() {
	if (eventAdded) return;
	eventAdded = true;
	document.addEventListener("compositionstart", compositionstart);
	document.addEventListener("compositionend", compositionend);
	document.addEventListener("input", onInput);
	document.addEventListener("click", onInput);
}

function removeInputListeners() {
	if (!eventAdded) return;
	eventAdded = false;
	document.removeEventListener("compositionstart", compositionstart);
	document.removeEventListener("compositionend", compositionend);
	document.removeEventListener("input", onInput);
	document.removeEventListener("click", onInput);
}

function compositionstart() {
	composing = true;
}



async function compositionend() {
	composing = false;
	await read();
}

function onInput() {
	if (!composing) read().catch(console.warn);
}

let lastStart: number, lastEnd: number, lastValue: string;

async function read() {
	await timer.reWait();
	const {pageContext:cxt} = cs
	const el = cxt.inputEl;
	if (!el) return;
	const value = getInputValue(el);
	const {selectionStart: start, selectionEnd: end}: HTMLTextAreaElement = el;
	if (value && (lastStart != start || lastEnd != end)) {
		lastStart = start
		lastEnd = end
		const editText = start === end ? value.slice(0, start) : value.slice(start, end)
		console.log(start, end, editText)
	}
	if (value != null && value !== lastValue) {
		await timer.reWait(100);
		lastValue = value;
		console.log("当前输入值:", value);
	}
}
