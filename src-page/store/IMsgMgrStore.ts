import {defineStore} from "pinia";
import {IMessage, IMsgMgrApi} from "/src-com";
import {Api} from "../api";
import {Timer} from "gs-base";
import {strToRegex} from "/src-com/lib/strToRegex";
import {Store} from "./index";
import {Bool} from "gs-idb-basic";

export interface IMsgMgrState {
	pageSize: number
	pageNo: number
	msgs: IMessage[]
	route: string
	filter: string
	filtered: IMessage[]
}

export interface IMsgMgrGetters {
	queryMethod: keyof IMsgMgrApi
	filtered: IMessage[]
	totalPage: number
	total: number
}

export interface IMsgMgrActions {
	executeFilter(remote?: boolean): Promise<void>

	loadData(): Promise<void>

	clear(): void

	remove(id: number, action?: 'native' | 'recover'): Promise<void>

	removeAllTrash(): Promise<void>
}

export interface IMsgMgrStore extends IMsgMgrState, IMsgMgrGetters, IMsgMgrActions {
}

const filterTimer = new Timer();


export const useMsgMgrStore: () => IMsgMgrStore = defineStore('msg-mgr-store', {
	state: (): IMsgMgrState => {
		return {
			msgs: [],
			route: "",
			filter: '',
			filtered: [],
			pageNo: 1,
			pageSize: 100
		};
	},
	getters: {
		queryMethod({route}: IMsgMgrState) {
			return `query${route.charAt(0).toUpperCase()}${route.slice(1)}`
		},
		total({route}: IMsgMgrState) {
			return Store.message.status[`${route}Count`]
		},
		totalPage({total, pageSize}: IMsgMgrState) {
			return Math.ceil(total / pageSize);
		}
	},
	actions: <IMsgMgrActions>{
		async loadData(): Promise<void> {
			const {queryMethod, pageNo: page, pageSize: size}: IMsgMgrStore = this;
			this.msgs = await Api.msgMgr[queryMethod as any]({page, size});
			this.executeFilter(false, true);
		},
		clear() {
			this.msgs.length = 0;
			this.filtered.length = 0;
		},
		async executeFilter(remote?: boolean, skipTimeOut?: boolean): Promise<void> {
			if (!skipTimeOut) {
				await filterTimer.reWait(remote ? 300 : 200);
			}
			document.querySelector('.OtherLayout').scrollTop = 0
			const {filter, msgs, queryMethod}: IMsgMgrState = this;
			if (!filter?.trim().length) {
				this.filtered = [...msgs];
				return;
			}
			if (remote) {
				this.filtered = await Api.msgMgr[queryMethod as any]({regex: filter});
				return;
			}
			const reg = strToRegex(filter);
			this.filtered = this.msgs.filter(m => reg.test(m.text));
		},
		async remove(id: number, action?: 'native' | 'recover'): Promise<void> {
			console.log(id, action)
			const {msgs}: IMsgMgrState = this;
			const i = msgs.findIndex(m => m.id === id);
			if (i >= 0) {
				msgs.splice(i, 1);
				await this.executeFilter(false, true);
			}
			if (action === 'native') {
				await Api.msgMgr.nativeRemove(id);
			} else if (action === 'recover') {
				await Api.msgMgr.saveChange({id, deleted: Bool.False})
			} else {
				await Api.message.removeMessage(id);
			}
			await Store.message.loadStatus();
			await this.loadData();
		},
		async removeAllTrash(): Promise<void> {
			if (!await Store.front.showConfirm('确定需要清空回收站？')) {
				return;
			}
			this.msgs.length = 0;
			await this.executeFilter(false, true);
			await Api.msgMgr.clearTrash();
			await Store.message.loadStatus();
			await this.loadData();
		}
	}
}) as any;
