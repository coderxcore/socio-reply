// 你已有的底层函数
import {wait} from "gs-base";

export function debugSendKey(
	tabId: number,
	type: "keyDown" | "keyUp",
	key: string,
	opts: any = {}
) {
	return chrome.debugger.sendCommand(
		{tabId},
		"Input.dispatchKeyEvent",
		{type, key, ...opts}
	);
}

// 高层全部封进静态类
export class DebugInput {

	#_isMac?: boolean;

	static get #isMac() {
		if (this.#_isMac !== undefined) {
			return this.#_isMac;
		}
		return this.#_isMac = /Mac/i.test(navigator.userAgent);
	}

	static async pressKey(tabId: number, key: string, opts: any = {}) {
		await debugSendKey(tabId, "keyDown", key, opts);
		await debugSendKey(tabId, "keyUp", key, opts);
	}

	static async pressCombo(tabId: number, modifier: string, key: string) {
		await debugSendKey(tabId, "keyDown", modifier);
		await this.pressKey(tabId, key);
		await debugSendKey(tabId, "keyUp", modifier);
	}

	static async deletePaste(tabId: number) {
		await this.delete(tabId);
		await wait(30);
		await this.paste(tabId);
	}

	static async paste(tabId: number) {
		const mod = this.#isMac ? "Meta" : "Control";
		await this.pressCombo(tabId, mod, "v");
	}

	static async selectAll(tabId: number) {
		const mod = this.#isMac ? "Meta" : "Control";
		await this.pressCombo(tabId, mod, "a");
	}

	static async delete(tabId: number) {
		await this.pressKey(tabId, "Delete");
	}

	static async selectAllDelete(tabId: number) {
		await this.selectAll(tabId);
		await this.delete(tabId);
	}

	static async typeChar(tabId: number, ch: string) {
		await debugSendKey(tabId, "keyDown", ch, {
			text: ch,
			unmodifiedText: ch
		});
		await debugSendKey(tabId, "keyUp", ch);
	}

	static async typeText(tabId: number, text: string) {
		for (const ch of text) {
			await this.typeChar(tabId, ch);
		}
	}
}
