import {isEditable} from "./isEditable";
import {getInputValue} from "./getInputValue";
import {Timer} from "gs-base";
import {Hub} from "./Hub";

const timer = new Timer(300);

let lastInputEl: HTMLElement | undefined;
let composing = false;

document.addEventListener("focusin", check, true);

async function check() {
	const el = document.activeElement as HTMLElement;
	if (isEditable(el)) {
		if(lastInputEl !== el) {
			removeInputListeners();
			lastInputEl = el;
			addInputListeners();
		}
		await Hub.sendStatus(el);
	}
}

function addInputListeners() {
	document.addEventListener("compositionstart", compositionstart);
	document.addEventListener("compositionend", compositionend);
	document.addEventListener("input", onInput);
}

function removeInputListeners() {
	document.removeEventListener("compositionstart", compositionstart);
	document.removeEventListener("compositionend", compositionend);
	document.removeEventListener("input", onInput);
}

function compositionstart() {
	composing = true;
}

async function compositionend() {
	composing = false;
	await read();
}

function onInput() {
	if (!composing) read();
}

async function read() {
	await timer.reWait();
	const value = getInputValue(lastInputEl);
	if (value != null) {
		console.log("当前输入值:", value);
	}
}
