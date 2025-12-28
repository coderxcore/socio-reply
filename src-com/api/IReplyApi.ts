import {MsgMethods, RemoteMethods} from "gs-br-ext";

interface IIReplyBase {

	queryReply(text: string): Promise<any[]>;

}

export interface IReplyApi extends IIReplyBase, RemoteMethods {
}

export interface IReplyService extends IIReplyBase, MsgMethods {
}
