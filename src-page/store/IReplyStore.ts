import {defineStore} from "pinia";
import {Api} from "../api";

export interface IReplyState {
	input: string
}

export interface IReplyStore extends IReplyState {
	queryReply(): void;
}

export const useReplyStore: () => IReplyStore = defineStore('reply', {
	state: (): IReplyState => {
		return {
			input: ''
		};
	},
	actions: {
		async queryReply() {
			const {input} = this;
			const replies = await Api.reply.queryReply(input);
			console.log(replies)
		}
	}
}) as any;
