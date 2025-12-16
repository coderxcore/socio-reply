import './style/index.scss'
import {createApp} from 'vue';
import App from './App.vue';
import {createPinia} from 'pinia'

const app = createApp(App).use(createPinia());

export function initVue() {
	const div = document.createElement('div');
	div.id = 'demo_app'
	document.documentElement.appendChild(div);
	app.mount(div)
}
