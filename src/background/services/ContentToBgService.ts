import {setMsgMethod} from "gs-br-ext";
import {IContentToBgService, IInputStatus} from "/src-com";

setMsgMethod<IContentToBgService>({
	async setInputStatus(status: IInputStatus): Promise<void> {
		console.log(status)
	}
})
