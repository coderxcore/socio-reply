import "./dom/event-register";
import './services/ContentService'
import '/src-page/style/index.scss'

export default defineContentScript({
	matches: ['<all_urls>'],
	main(): void | Promise<void> {
		console.log('--ContentInputStatus--')
	}
});
