import './style/index.scss'
import {createApp} from 'vue';
import App from './App.vue';
import {createPinia} from 'pinia'
import {router} from './view'

createApp(App)
	.use(createPinia())
	.use(router)
	.mount('#app')