import {defineStore} from "pinia";
import {Api} from "../api";
import {IMessageStatus, ISearchTerm} from "/src-com";
import {ICursorChangeEvent} from "../type";

export interface IMessageState {
	input: string
	terms: ISearchTerm[]
	status: IMessageStatus
}

export interface IMessageStore extends IMessageState {

	queryTerm(text: string): Promise<void>;

	queryMessage(): Promise<void>;

	loadStatus(): Promise<void>;
}

export const useMessageStore: () => IMessageStore = defineStore('message', {
	state: (): IMessageState => {
		return {
			input: '',
			terms: [],
			status: {
				draftCount: NaN,
				historyCount: NaN,
				trashCount: NaN,
				referencesCount: NaN,
			}
		};
	},
	actions: <IMessageStore>{
		async queryTerm(text: string) {
			this.terms.length = 0;
			this.terms = await Api.search.searchTerm(text);
		},
		async queryMessage() {
			const {input} = this;
			console.log(input)
		},
		async loadStatus() {
			this.status = await Api.message.messageStatus();
		}
	}
}) as any;
