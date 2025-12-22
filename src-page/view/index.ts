import {createRouter, createWebHashHistory} from 'vue-router';
import Home from './Home.vue'
import OtherLayout from './OtherLayout.vue'
import Draft from './Draft.vue'
import History from './History.vue'
import Trash from './Trash.vue'
import References from './References.vue'
import Settings from './Settings/Settings.vue'

export const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			name: "home",
			alias: "/",
			path: "/home",
			component: Home
		},
		{
			name: "OtherLayout",
			path: "/",
			component: OtherLayout,
			children:[
				{
					name: "settings",
					path: "settings",
					component: Settings
				},
				{
					name: "references",
					path: "references",
					component: References
				},
				{
					name: "draft",
					path: "draft",
					component: Draft
				},
				{
					name: "history",
					path: "history",
					component: History
				},
				{
					name: "trash",
					path: "trash",
					component: Trash
				},
			]
		},
	]
});