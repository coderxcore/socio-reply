/**
 * 安全获取元素真实 line-height（px）
 * 处理 line-height = normal 的情况
 */
export function getSafeLineHeight(el) {
	const style = getComputedStyle(el);
	const lh = style.lineHeight;

	// 已经是确定值（如 "20px"）
	if (lh !== 'normal') {
		return parseFloat(lh);
	}

	// normal：通过真实 DOM 测量
	const clone = document.createElement(el.tagName);
	clone.textContent = 'A';
	clone.style.font = style.font;              // 关键：保证字体完全一致
	clone.style.fontSize = style.fontSize;
	clone.style.fontFamily = style.fontFamily;
	clone.style.fontWeight = style.fontWeight;
	clone.style.letterSpacing = style.letterSpacing;
	clone.style.whiteSpace = 'nowrap';
	clone.style.position = 'absolute';
	clone.style.visibility = 'hidden';
	clone.style.lineHeight = 'normal';
	clone.style.padding = '0';
	clone.style.border = '0';
	clone.style.margin = '0';

	document.body.appendChild(clone);
	const height = clone.getBoundingClientRect().height;
	document.body.removeChild(clone);

	return height;
}
