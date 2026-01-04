import {MsgMethods, RemoteMethods} from "gs-br-ext";

interface IImportBase {
	importReferences(references: string[]): Promise<void>;
}

export interface IImportApi extends IImportBase, RemoteMethods {
}

export interface IImportService extends IImportBase, MsgMethods {
}
