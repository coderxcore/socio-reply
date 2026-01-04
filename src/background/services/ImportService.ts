import {setMsgMethod} from "gs-br-ext";
import {IImportService} from "/src-com";

setMsgMethod<IImportService>({
	async importReferences(references: string[]): Promise<void> {
		console.log(references)
	}
})

