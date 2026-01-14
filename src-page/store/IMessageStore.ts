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
}

export const useMessageStore: () => IMessageStore = defineStore('message', {
	state: (): IMessageState => {
		return {
			input: localStorage.messageInput || '',
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
					const txt = input.slice(start - len, end + len);
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
			localStorage.messageInput = this.input;
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
		}
	}
}) as any;
