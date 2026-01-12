import {defineStore} from "pinia";
import {wait} from "gs-base";

export interface IUpdateProgress {

	/**
	 * 当前进度值
	 * - 未提供`total`时，将直接使用`process`
	 * - 小于 `1`时，进度为 `Math.ceil(process*max)`
	 * - 大于等 `max` 时，进度为 `max`
	 */
	progress: number,

	/**
	 * 总共进度值
	 * - 未提供时，将直接使用`process`
	 * - 提供时，进度为：`Math.ceil(process/total*max)`
	 */
	total?: number

	/**
	 * 进度条的基础值，默认值为 `0`
	 * - 未提供时，将直接使用`process`
	 * - 提供时，进度为：` base + process `
	 */
	base?: number

	/**
	 * 当前进度条允许的最大进度值，默认值为 100
	 */
	max?: number

	/**
	 * 进度条显示的消息
	 * - 空字符串表示不显示消息
	 * - `undefined` 表示不更新消息
	 */
	msg?: string
}

export interface IFrontState {
	progress: number;
	message: string;
	confirm?: (result: boolean) => void | Promise<void>;
}

export interface IFrontGetters {
	readonly show: boolean;
	readonly showProgress: boolean;
}

export interface IFrontStore extends IFrontState, IFrontGetters {
	updateProgress(progress: IUpdateProgress): void;

	hide(): void;

	showMessage(msg: string, time?: number): Promise<void>;
}

export const useFrontStore: () => IFrontStore = defineStore('front', {
	state: (): IFrontState => {
		return {
			progress: -1,
			message: '',
			confirm: undefined
		};
	},
	getters: {
		show({showProgress, message, confirm}: IFrontState): boolean {
			return Boolean(showProgress || message || confirm);
		},
		showProgress({progress}: IFrontState): boolean {
			return progress >= 0;
		},
	},
	actions: <IFrontStore>{
		updateProgress({progress, total, base = 0, max = 100, msg}: IUpdateProgress) {
			let calculatedProgress = 0;
			total < 1 && (total = 1)
			if (total !== undefined) {
				calculatedProgress = Math.ceil((progress / total) * max);
			} else if (progress < 1) {
				calculatedProgress = Math.ceil(progress * max);
			} else {
				calculatedProgress = progress;
			}
			this.progress = Math.min(base + calculatedProgress, max);

			if (msg !== undefined) {
				this.message = msg;
			}
		},
		hide() {
			this.progress = -1;
			this.message = '';
			this.confirm = undefined;
		},
		async showMessage(msg: string, time: number = 3): Promise<void> {
			this.hide();
			this.message = msg;
			await wait(time * 1000);
			this.hide();
		}
	}
}) as any;
