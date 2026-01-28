import './style/index.scss'
import {createApp} from 'vue';
import App from './App.vue';
import {createPinia} from 'pinia'
import {Api} from "/src-page/api";

const app = createApp(App)
	.use(createPinia());

const rootContainer = document.createElement('message-assistant');
document.documentElement.appendChild(rootContainer);

const rootDiv = document.createElement('div');
rootContainer.attachShadow({mode: 'open'}).appendChild(rootDiv);

app.mount(rootDiv);

window.addEventListener('pagehide',  async () => {
	await Api.contentToBg.saveCurrMsgs();
});
