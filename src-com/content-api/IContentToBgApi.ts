import {MsgMethods, RemoteMethods} from "gs-br-ext";

interface IContentToBgBase {
}

export interface IContentToBgApi extends IContentToBgBase, RemoteMethods {

	saveCurrMsgs(data?: any): Promise<void>;
}

export interface IContentToBgService extends IContentToBgBase, MsgMethods {

	saveCurrMsgs(data: any, sender: chrome.runtime.MessageSender): Promise<void>;
}
