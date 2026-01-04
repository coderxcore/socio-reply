import {defineStore} from "pinia";
import {openFileHandler} from "grain-sand-web-fs";
import {router} from "../view";
import {ISplitOption, splitFile} from "/src-com";
import {Timer} from "gs-base";
import {Api} from "../api";

export interface IImportReferencesState {
	file?: File
	pattern: string
	preview: string[]
}

export interface IImportReferencesGetter {
	readonly delimiter: RegExp
}

export interface IImportReferencesStore extends IImportReferencesState, IImportReferencesGetter {
	selectFile(): Promise<void>

	updatePreview(): Promise<void>

	confirmImport(onProgress?: ISplitOption['onProgress']): Promise<void>
}

const previewCount = 1000;
const taskItemCount = 30;

const timer = new Timer(500);

export const useImportReferencesStore: () => IImportReferencesStore = defineStore('import-references', {
	state: (): IImportReferencesState => {
		return {
			file: undefined,
			pattern: '(\\s*\\n+\\s*){2,}',
			preview: []
		};
	},
	getters: {
		delimiter() {
			return new RegExp(this.pattern, 'g');
		}
	},
	actions: {
		async selectFile() {
			try {
				const handle = await openFileHandler({accept: '.txt'});
				if (!handle) {
					return;
				}
				this.file = await handle.getFile();
				if (router.currentRoute.value.name !== 'import-references') {
					await router.push({name: 'import-references'});
				}
				await this.updatePreview();
			} catch (e) {
			}
		},
		async updatePreview() {
			await timer.reWait();
			const {file, delimiter} = this;
			this.preview.length = 0;
			const tmp = [];
			let n = 1;
			for await (const part of splitFile(file, {delimiter})) {
				tmp.push(part.replace(/\n/g,'<br>'));
				if (n++ >= previewCount) {
					break;
				}
			}
			this.preview = tmp;
		},
		async confirmImport(onProgress?: ISplitOption['onProgress']) {
			const {file, delimiter} = this;
			const rows = [];
			for await (const part of splitFile(file, {delimiter, onProgress})) {
				rows.push(part);
				if (rows.length >= taskItemCount) {
					await Api.import.importReferences(rows);
					rows.length = 0;
				}
			}
			if (rows.length) {
				await Api.import.importReferences(rows);
			}
		}
	}
}) as any;
