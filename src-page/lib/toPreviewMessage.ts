import {ISearchMessage} from "/src-com";
import {IMessagePreview, PartType} from "../type";

export function toPreviewMessage(msg: Partial<ISearchMessage>, input: string): IMessagePreview[] {
	const msgs: IMessagePreview[] = [];
	msgs.push({
		srcMsg: msg,
		parts: [
			{
				type: PartType.Result,
				text: msg.text || '',
			}
		]
	});
	return msgs;
}
