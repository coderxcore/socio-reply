import {MsgMethods, RemoteMethods} from "gs-br-ext";
import {IMessage, IMessageQuery, ISearchMessage} from "../db";

export interface IMessageStatus {
	// draftCount: number;
	historyCount: number;
	trashCount: number;
	referencesCount: number
}

interface IMessageBase {

	clearMessageStatusCache(): void | Promise<void>;

	messageStatus(): Promise<IMessageStatus>;

	loadMessage(query: IMessageQuery): Promise<Partial<ISearchMessage>[]>;

	sendMessageToContent(msg: string): void | Promise<void>;

	removeMessage(id: number): Promise<void>;

	addMessage(msg: IMessage): Promise<any>;

}

export interface IMessageApi extends IMessageBase, RemoteMethods {
}

export interface IMessageService extends IMessageBase, MsgMethods {
}
