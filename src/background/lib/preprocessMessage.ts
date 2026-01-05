import {IMessage} from "/src-com";
import {hash} from "gs-search";
import {messageTokens} from "./messageTokens";

export async function preprocessMessages(messages: IMessage[]): Promise<IMessage[]> {
	return messages.map(preprocessMessage);
}

export function preprocessMessage(msg: IMessage): IMessage {
	msg.hash = hash(msg.text);
	msg.tokens = messageTokens(msg.text);
	return msg;
}
