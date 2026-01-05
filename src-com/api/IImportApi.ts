import {MsgMethods, RemoteMethods} from "gs-br-ext";
import {IMessage} from "../db/IMessage";

interface IImportBase {

	startImport(text: string): Promise<void>;

	importReferences(references: IMessage[]): Promise<void>;

	endImport(): Promise<void>;

}

export interface IImportApi extends IImportBase, RemoteMethods {
}

export interface IImportService extends IImportBase, MsgMethods {
}
