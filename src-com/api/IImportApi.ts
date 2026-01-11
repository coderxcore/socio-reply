import {MsgMethods, RemoteMethods} from "gs-br-ext";
import {IMessage} from "../db/IMessage";

interface IImportBase {


	importReferences(references: IMessage[]): Promise<any>;

}

export interface IImportApi extends IImportBase, RemoteMethods {
}

export interface IImportService extends IImportBase, MsgMethods {
}
