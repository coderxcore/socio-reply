import {isEditable} from "../util/isEditable";
import {Timer} from "gs-base";
import {startListenerInput} from "./startListenerInput";

let lastInputEl: HTMLElement | undefined, lastEl: HTMLElement | undefined;

const timer = new Timer(20);

export function registerRootListener() {
	document.addEventListener("focusin", check, true);
}

async function check() {
	await timer.reWait()
	const el = document.activeElement as HTMLElement;
	if (el === lastEl) {
		return;
	}
	lastEl = el;
	if (isEditable(el)) {
		lastInputEl = el;
	} else {
		lastInputEl = undefined;
	}
	startListenerInput(lastInputEl);
}
