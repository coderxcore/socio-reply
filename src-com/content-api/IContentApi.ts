import {MsgMethods, RemoteMethods} from "gs-br-ext";

interface IContentBase {

}

export interface IContentApi extends IContentBase, RemoteMethods {
}

export interface IContentService extends IContentBase, MsgMethods {
}
