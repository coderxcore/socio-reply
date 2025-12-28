import {setMsgMethod} from "gs-br-ext";
import {IReplyService} from "/src-com";

setMsgMethod<IReplyService>({
	async queryReply(text: string): Promise<any[]> {
		console.log(text)
		return [];
	}
})
