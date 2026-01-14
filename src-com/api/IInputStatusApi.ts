import {MsgMethods, RemoteMethods} from "gs-br-ext";

interface IInputStatusBase {

}

export interface IInputStatusApi extends IInputStatusBase, RemoteMethods {
}

export interface IInputStatusService extends IInputStatusBase, MsgMethods {
}
