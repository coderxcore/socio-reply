import '../style/index.scss'
import {createApp} from 'vue';
import App from './App.vue';
import {createPinia} from 'pinia'

const app = createApp(App)
	.use(createPinia());

const rootDiv = document.createElement('message-assistant');
document.documentElement.appendChild(rootDiv);
const shadowRoot = rootDiv.attachShadow({mode: 'closed'})
const styleEl = document.createElement('link');
styleEl.rel = 'stylesheet';
styleEl.href = chrome.runtime.getURL('content-scripts/content.css');
shadowRoot.appendChild(styleEl);
const appRoot = document.createElement('div');
appRoot.id = 'app';
shadowRoot.appendChild(appRoot)
app.mount(appRoot);
