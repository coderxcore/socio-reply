import {StorageLocal} from "gs-br-ext";
import {IIndexWaitStart} from "../type";

const IndexWaitStartKey = 'index-wait-start';

export class IndexStatus {

	static async getStart(): Promise<IIndexWaitStart> {
		return await StorageLocal.getValue(IndexWaitStartKey);
	}

	static async markStart(start: IIndexWaitStart): Promise<IIndexWaitStart> {
		const storedStart = await this.getStart();
		if (storedStart) {
			return storedStart;
		}
		await this.changeStart(start);
		return start;
	}

	static async changeStart(start: IIndexWaitStart): Promise<void> {
		await StorageLocal.setValue(IndexWaitStartKey, start);
	}

	static async clearStart(): Promise<void> {
		await StorageLocal.raw.remove(IndexWaitStartKey);
	}

}
