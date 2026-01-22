import {MsgMethods, RemoteMethods} from "gs-br-ext";
import {IMessage} from "../db";

export interface IPageParam {
	page?: number
	size?: number
	regex?: string
}

interface IMsgMgrBase {

	queryTrash(param?: IPageParam): Promise<IMessage[]>

	queryHistory(param?: IPageParam): Promise<IMessage[]>

	queryReferences(param?: IPageParam): Promise<IMessage[]>

	clearTrash(): Promise<void>

	nativeRemove(id: number): Promise<IMessage>

	saveChange(msg: Partial<IMessage>): Promise<IMessage>

}

export interface IMsgMgrApi extends IMsgMgrBase, RemoteMethods {
}

export interface IMsgMgrService extends IMsgMgrBase, MsgMethods {
}
