import {MsgMethods, RemoteMethods} from "gs-br-ext";
import {IMessage, ISearchReply} from "../db/IMessage";

export interface IMessageStatus {
	draftCount: number;
	historyCount: number;
	trashCount: number;
	referencesCount: number;
}

interface IMessageBase {

	clearMessageStatusCache(): void | Promise<void>;

	messageStatus(): Promise<IMessageStatus>;

}

export interface IMessageApi extends IMessageBase, RemoteMethods {
}

export interface IMessageService extends IMessageBase, MsgMethods {
}
