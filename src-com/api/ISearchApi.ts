import {MsgMethods, RemoteMethods} from "gs-br-ext";
import {ITerm} from "../db/ITerm";
import {IMessage} from "../db/IMessage";

interface ISearchBase {

	searchTerm(text: string): Promise<ITerm[]>;

	searchMsg(text: string): Promise<IMessage[]>;
}

export interface ISearchApi extends ISearchBase, RemoteMethods {
}

export interface ISearchService extends ISearchBase, MsgMethods {
}
