import './services/SettingsService'
import './services/LocalService'
import './services/MessageService'
import './services/ImportService'
import './services/SceneService'
import './services/IndexService'
import './services/SearchService'
import {updateIndex} from "./search/updateIndex";
import './search/searchEmoji'

export default defineBackground({
	main() {
		chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch(console.error)
		// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		// 	if (tab.url?.includes('options.html')) {
		// 		(chrome.sidePanel as any).close({ tabId });
		// 	}
		// });
		setTimeout( async ()=>{
			await updateIndex()
		})
	}
})
