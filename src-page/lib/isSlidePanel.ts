export function isSidePanel(needExtPage: boolean = false) {
	return /^\/side-*panel/i.test(location.pathname) && (!needExtPage || isExtPage());
}

export function isExtPage() {
	return /extension/i.test(location.protocol);
}
