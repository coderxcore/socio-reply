import {MsgMethods, RemoteMethods} from "gs-br-ext";
import {IInputStatus} from "../other";

interface IContentToBgBase {
	setInputStatus(status: IInputStatus): Promise<void>;
}

export interface IContentToBgApi extends IContentToBgBase, RemoteMethods {
}

export interface IContentToBgService extends IContentToBgBase, MsgMethods {
}
