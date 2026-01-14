import {isEditable} from "../util/isEditable";
import {sendStatus} from "../util/sendStatus";
import {getInputValue} from "../util/getInputValue";
import {Timer} from "gs-base";

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
		await sendStatus(el);
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
	composing = true;   // 输入法开始
}

function compositionend() {
	composing = false;  // 输入法结束
	read();
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
