import {setMsgMethod} from "gs-br-ext";
import {IContentToBgService} from "/src-com";

setMsgMethod<IContentToBgService>({
	async saveCurrMsgs(data: any, sender: chrome.runtime.MessageSender): Promise<void> {
		console.log(sender)
	}

})
