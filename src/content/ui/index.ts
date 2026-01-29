import './style/index.scss'
import {createApp} from 'vue';
import App from './App.vue';
import {createPinia} from 'pinia'
import {Api} from "/src-page/api";
import {rootEl} from "../context/contextVars";

const app = createApp(App)
	.use(createPinia());

document.documentElement.appendChild(rootEl);

const rootDiv = document.createElement('div');
rootEl.attachShadow({mode: 'open'}).appendChild(rootDiv);

app.mount(rootDiv);

window.addEventListener('pagehide',  async () => {
	await Api.contentToBg.saveCurrMsgs();
});
