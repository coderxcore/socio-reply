import {MsgMethods, RemoteMethods} from "gs-br-ext";
import {IMessage, IMessageQuery} from "../db";

export interface IMessageStatus {
	draftCount: number;
	historyCount: number;
	trashCount: number;
	referencesCount: number
}

interface IMessageBase {

	clearMessageStatusCache(): void | Promise<void>;

	messageStatus(): Promise<IMessageStatus>;

	loadMessage(query: IMessageQuery): Promise<IMessage[]>;

	sendMessageToContent(msg: string): void | Promise<void>;

}

export interface IMessageApi extends IMessageBase, RemoteMethods {
}

export interface IMessageService extends IMessageBase, MsgMethods {
}
