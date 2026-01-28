function writeToContentEditable(el: HTMLElement, text: string) {
	el.focus();

	const sel = window.getSelection();
	if (!sel) return;

	// 全选
	const range = document.createRange();
	range.selectNodeContents(el);
	sel.removeAllRanges();
	sel.addRange(range);

	// 删除选中内容
	document.execCommand("delete");

	// 以“粘贴/输入”的方式插入
	document.execCommand("insertText", false, text);

	// 某些框架依赖 input 事件
	el.dispatchEvent(new Event("input", { bubbles: true }));
}

function writeToContentEditable2(el: HTMLElement, text: string) {
	el.focus();

	const sel = window.getSelection();
	if (!sel) return;

	// 全选内容
	const range = document.createRange();
	range.selectNodeContents(el);
	sel.removeAllRanges();
	sel.addRange(range);

	// 模拟删除（beforeinput + input）
	el.dispatchEvent(new InputEvent("beforeinput", {
		bubbles: true,
		cancelable: true,
		inputType: "deleteContent",
	}));

	range.deleteContents();

	el.dispatchEvent(new InputEvent("input", {
		bubbles: true,
		inputType: "deleteContent",
	}));

	// 模拟粘贴/插入
	el.dispatchEvent(new InputEvent("beforeinput", {
		bubbles: true,
		cancelable: true,
		data: text,
		inputType: "insertFromPaste",
	}));

	const node = document.createTextNode(text);
	range.insertNode(node);

	// 光标移到末尾
	range.setStartAfter(node);
	range.setEndAfter(node);
	sel.removeAllRanges();
	sel.addRange(range);

	el.dispatchEvent(new InputEvent("input", {
		bubbles: true,
		data: text,
		inputType: "insertFromPaste",
	}));
}
