import "./ui";

export default defineContentScript({
	matches: ['<all_urls>'],
	cssInjectionMode: 'ui',
	main(): void | Promise<void> {
		console.log('plugin loaded')
	}
});
