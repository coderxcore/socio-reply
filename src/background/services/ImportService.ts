import {setMsgMethod} from "gs-br-ext";
import {IImportService, IMessage} from "/src-com";
import {Status} from "../Status";
import {preprocessMessages} from "../lib/preprocessMessage";

setMsgMethod<IImportService>({
	async startImport(text: string): Promise<void> {
		await Status.setImportStart(text)
	},
	async endImport(): Promise<void> {
		await Status.clearImportStart();
	},
	async importReferences(references: IMessage[]): Promise<void> {
		const time = Date.now();
		references = await preprocessMessages(references);
		console.log(Date.now() - time, references)
	},
})

