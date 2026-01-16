import {defineStore} from "pinia";
import {Api} from "../api";
import {IMessage, IMessageQuery, IMessageStatus, ISearchMessage, ISearchTerm} from "/src-com";
import {IMessagePreview} from "../type";
import {toPreviewMessage} from "../lib/toPreviewMessage";

export interface IMessageState {
	input: string
	terms: ISearchTerm[]
	status: IMessageStatus
	searchMessages: ISearchMessage[]
	lastMessages: IMessage[]
	query: IMessageQuery,
	previewMessages: IMessagePreview[]
}

export interface IMessageStore extends IMessageState {
	queryTerm(text: string, start: number, end: number): Promise<void>;

	queryMessage(): Promise<void>;

	loadStatus(): Promise<void>;

	loadMessage(): Promise<void>;

	toPreviewMessage(msg: Partial<ISearchMessage>): void

	remove(msgProp: keyof IMessageState, msg: Partial<ISearchMessage>): Promise<void>;
}

export const useMessageStore: () => IMessageStore = defineStore('message', {
	state: (): IMessageState => {
		return {
			input: '',
			terms: [],
			status: {} as any,
			searchMessages: [],
			lastMessages: [],
			query: {},
			previewMessages: [],
		};
	},
	actions: <IMessageStore>{
		async queryTerm(text, start, end) {
			this.terms.length = 0;
			const {input} = this as IMessageStore;
			this.terms = (await Api.search.searchTerm(text))
				.filter(t => {
					const len = t.text.length;
					const txt = input.slice(Math.max(0, start - len), Math.max(end + len, t.text.length));
					return !txt.includes(t.text);
				});
		},
		async queryMessage() {
			this.previewMessages.length = 0;
			if (!this.input) {
				this.searchMessages.length = [];
				return;
			}
			this.searchMessages = await Api.search.searchMsg(this.input);
		},
		async loadStatus() {
			this.status = await Api.message.messageStatus();
		},
		async loadMessage() {
			this.lastMessages = await Api.message.loadMessage(this.query);
			if (this.input) {
				await this.queryTerm(this.input)
				await this.queryMessage()
			}
		},
		toPreviewMessage(msg: Partial<ISearchMessage>) {
			this.previewMessages = toPreviewMessage(msg, this.input);
		},
		async remove(msgProp: keyof IMessageState, msg: Partial<ISearchMessage>) {
			console.log(msg)
			const {id} = msg;
			if (!id) return;
			const msgs = this[msgProp] as (ISearchMessage | IMessage)[];
			const index = msgs.findIndex(m => m.id === id);
			if (index < 1) return;
			msgs.splice(index, 1);
			await Api.message.removeMessage(msg.id);
		}
	}
}) as any;
