import"./dom/event-register";

export default defineContentScript({
	matches: ['<all_urls>'],    //这里填写你需要监听的网页路径
	main(ctx?: any): void | Promise<void> {
		console.log('--ContentInputStatus--')
	}
});
