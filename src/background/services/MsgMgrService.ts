import {setMsgMethod} from "gs-br-ext";
import {IMessage, IMsgMgrService, IPageParam} from "/src-com";
import {Db} from "../db";
import {Bool} from "gs-idb-basic";
import {strToRegex} from "/src-com/lib/strToRegex";
import {Delete, FindFn} from "gs-idb-pro";
import {clearMessageStatusCache} from "../repo/messageStatus";
import {Search} from "../search/Search";

const DefaultPageParam: IPageParam = Object.freeze({
	page: 1,
	size: 100
})

function createFn(regex?: string): FindFn<IMessage> | undefined {
	if (!regex?.trim()?.length) {
		return undefined;
	}
	const reg = strToRegex(regex);
	return (msg) => reg.test(msg.text);
}

setMsgMethod<IMsgMgrService>({
	async clearTrash(): Promise<void> {
		try {
			await Db.msgDeleted.cursor({
				query: Bool.True,
				fn: () => ({modify: Delete})
			})
		} finally {
			clearMessageStatusCache();
		}
	},
	async nativeRemove(id: number): Promise<IMessage> {
		try {
			const [msg] = await Db.message.delete(id, {physical: true, returns: true}) || []
			if (msg) {
				await Search.message.removeDocument(msg.id)
			}
			return msg;
		} finally {
			clearMessageStatusCache();
		}
	},
	queryHistory(param?: IPageParam): Promise<IMessage[]> {
		const {page, size, regex}: IPageParam = {...DefaultPageParam, ...param};
		return Db.msgContentDeleted.filter({
			query: [Bool.True, Bool.False],
			limit: size,
			preSkip: (page - 1) * size,
			fn: createFn(regex)
		});
	},
	queryReferences(param?: IPageParam): Promise<IMessage[]> {
		const {page, size, regex}: IPageParam = {...DefaultPageParam, ...param};
		return Db.msgReferenceDeleted.filter({
			query: [Bool.True, Bool.False], limit: size, preSkip: (page - 1) * size,
			fn: createFn(regex)
		});
	},
	queryTrash(param?: IPageParam): Promise<IMessage[]> {
		const {page, size, regex}: IPageParam = {...DefaultPageParam, ...param};
		return Db.msgDeleted.filter({
			query: Bool.True, limit: size, preSkip: (page - 1) * size,
			fn: createFn(regex)
		});
	},
	async saveChange(msg: IMessage): Promise<IMessage> {
		try {
			return Db.message.change(msg);
		} finally {
			clearMessageStatusCache();
		}
	}
})
