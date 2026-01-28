import {Timer} from "gs-base";

import {ContentStore as cs} from "../ui/store";
import {getInputValue} from "../lib/getInputValue";
import {getSelectionRange} from "/src-page/lib/getSelectionRange";

const arrowReg = /^Arrow/
const timer = new Timer(200);
let composing = false;
let eventAdded = false;

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
	document.addEventListener("compositionstart", compositionstart);
	document.addEventListener("compositionend", compositionend);
	document.addEventListener("input", onInput);
	document.addEventListener("click", onInput);
	document.addEventListener("keyup", onkeyup);
}

function removeInputListeners() {
	if (!eventAdded) return;
	eventAdded = false;
	document.removeEventListener("compositionstart", compositionstart);
	document.removeEventListener("compositionend", compositionend);
	document.removeEventListener("input", onInput);
	document.removeEventListener("click", onInput);
	document.removeEventListener("keyup", onkeyup);
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

function onkeyup(e: KeyboardEvent) {
	if(arrowReg.test(e.code)) {
		onInput();
	}
}

let lastStart: number, lastEnd: number, lastValue: string;

async function read() {
	await timer.reWait();
	const {pageContext: cxt} = cs
	const el = cxt.el;
	if (!el) return;
	const value = cxt.inputItem.text = getInputValue(el);
	const {start, end} = getSelectionRange(el);
	if (lastStart != start || lastEnd != end) {
		lastStart = start
		lastEnd = end
		const search = start === end ? value.slice(0, start) : value.slice(start, end)
		await cxt.queryTerm(search, start, end)
	}
	if (value != null && value !== lastValue) {
		await timer.reWait(100);
		lastValue = value;
		console.log("当前输入值:", value);
	}
}
