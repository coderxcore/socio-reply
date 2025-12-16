import {initVue} from './initVue';

export default defineContentScript({
	matches: ['<all_urls>'],    //这里填写你需要监听的网页路径
	main(ctx?: any): void | Promise<void> {
		initVue();
	}
});
