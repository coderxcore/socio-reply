import {setMsgMethod} from "gs-br-ext";
import {IContentToBgService} from "/src-com";
import {setInputStatus} from "../input/InputStatus";

setMsgMethod<IContentToBgService>({
	async setInputStatus(status, sender): Promise<void> {
		const tabId = status.tabId = sender.tab?.id;
		(chrome.sidePanel as any).open({tabId});
		await setInputStatus(status);
	}
})
