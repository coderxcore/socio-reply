export default {
	name: '__MSG_name__',
	description: '__MSG_description__',
	default_locale: 'zh_CN',
	icons: {
		"16": "icons/16.png",
		"48": "icons/48.png"
	},
	permissions: [
		"tabs",
		"sidePanel",
		"commands",
	],
	host_permissions: ["<all_urls>"],
	action: {
		default_title: "打开"
	},
	side_panel: {
		"default_title": "",
		"default_icon": {"16": "icons/16.png", "48": "icons/48.png"},
		"openPanelOnActionClick": true
	}
}