import {MsgMethods, RemoteMethods} from "gs-br-ext";

interface IDataBase {
	getEmojiCategories(): Record<string, string[]>|Promise<Record<string, string[]>>;
}

export interface IDataApi extends IDataBase, RemoteMethods {
}

export interface IDataService extends IDataBase, MsgMethods {
}
