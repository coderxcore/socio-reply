import {defineStore} from "pinia";
import {Api} from "../api";
import {IMessageStatus} from "/src-com";

export interface IMessageState {
	input: string
	status: IMessageStatus
}

export interface IMessageStore extends IMessageState {
	queryReply(): void;

	loadStatus(): Promise<void>;
}

export const useMessageStore: () => IMessageStore = defineStore('message', {
	state: (): IMessageState => {
		return {
			input: '',
			status: {
				draftCount: NaN,
				historyCount: NaN,
				trashCount: NaN,
				referencesCount: NaN,
			}
		};
	},
	actions: {
		async queryReply() {
			const {input} = this;
		},
		async loadStatus() {
			this.status = await Api.message.messageStatus();
		}
	}
}) as any;
