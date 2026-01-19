import {defineStore} from "pinia";
import {Api} from "../api";
import {builtInSceneIds, IMessage, IMessageQuery, IMessageStatus, ISearchMessage, ISearchTerm} from "/src-com";
import {IMessagePreview} from "../type";
import {toPreviewMessage} from "../lib/toPreviewMessage";
import {Timer} from "gs-base";

export interface IMessageState {
	terms: ISearchTerm[]
	status: IMessageStatus
	messages: IMessage[]
	query: IMessageQuery,
	previewMessages: IMessagePreview[]
}

export interface IMessageGetters {
}

export interface IMessageStore extends IMessageState, IMessageGetters {
	queryTerm(text: string, start: number, end: number): Promise<void>;

	loadStatus(): Promise<void>;

	loadMessage(delay?: number): Promise<void>;

	toPreviewMessage(msg: Partial<ISearchMessage>): void

	remove(msg: Partial<ISearchMessage>): Promise<void>;
}

const termTimer = new Timer(200);
const msgTimer = new Timer();

export const useMessageStore: () => IMessageStore = defineStore('message', {
	state: (): IMessageState => {
		return {
			terms: [],
			status: {} as any,
			messages: [],
			query: {
				sceneId: builtInSceneIds.genericScene,
				text: ''
			},
			previewMessages: [],
		};
	},
	getters: {},
	actions: <IMessageStore>{
		async queryTerm(text, start, end) {
			this.terms.length = 0;
			await termTimer.reWait();
			const {query: {text: input}} = this as IMessageStore;
			this.terms = (await Api.search.searchTerm(text))
				.filter(t => {
					const len = t.text.length;
					const txt = input.slice(Math.max(0, start - len), Math.max(end + len, t.text.length));
					return !txt.includes(t.text);
				});
		},
		async loadStatus() {
			this.status = await Api.message.messageStatus();
		},
		async loadMessage(delay: number = 300) {
			this.previewMessages.length = 0;
			this.messages.length = 0;
			if(!this.query.text.length) {
				this.terms.length = 0;
			}
			await msgTimer.reWait(delay);
			this.messages = await Api.message.loadMessage(this.query);
		},
		toPreviewMessage(msg: Partial<ISearchMessage>) {
			this.previewMessages = toPreviewMessage(msg, this.query.text);
		},
		async remove(msg: Partial<ISearchMessage>) {
			const {id} = msg;
			if (!id) return;
			const msgs = this.messages as (ISearchMessage | IMessage)[];
			const index = msgs.findIndex(m => m.id === id);
			if (index < 0) return;
			msgs.splice(index, 1);
			await Api.message.removeMessage(msg.id);
			await this.loadStatus();
		}
	}
}) as any;
