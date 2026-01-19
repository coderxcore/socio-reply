import {MsgMethods, RemoteMethods} from "gs-br-ext";
import {ISearchTerm} from "../db";

interface ITermBase {

	searchTerm(text: string): Promise<ISearchTerm[]>;
}

export interface ITermApi extends ITermBase, RemoteMethods {
}

export interface ITermService extends ITermBase, MsgMethods {
}
