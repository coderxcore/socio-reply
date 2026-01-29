import {Timer} from "gs-base";

import {ContentStore as cs} from "../ui/store";
import {getInputValue} from "../lib/getInputValue";
import {getSelectionRange} from "/src-page/lib/getSelectionRange";
import {ContextVars} from "./contextVars";

const timer = new Timer(200);

let lastStart: number, lastEnd: number, lastWidth: number, lastHeight: number;

export async function readInput() {
	await timer.reWait();
	const {pageContext: cxt} = cs
	const el = cxt.el;
	if (!el) return;
	const value = cxt.inputItem.text = getInputValue(el);
	const {start, end} = getSelectionRange(el);
	const {innerWidth: w, innerHeight: h} = window;
	const sizeChanged = lastWidth !== w || lastHeight !== h;
	lastWidth = w;
	lastHeight = h;
	if (lastStart != start || lastEnd != end || value !== ContextVars.lastValue || sizeChanged) {
		lastStart = start
		lastEnd = end
		const search = start === end ? value.slice(0, start) : value.slice(start, end)
		await cxt.queryTerm(search, start, end)
	}
	if (value !== ContextVars.lastValue || sizeChanged) {
		ContextVars.lastValue = value;
		await timer.reWait(100);
		console.log("当前输入值:", value);
	}
}
