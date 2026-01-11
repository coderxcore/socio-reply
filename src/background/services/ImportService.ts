import {setMsgMethod} from "gs-br-ext";
import {IImportService, IMessage} from "/src-com";
import {preprocessMessages} from "../pre/preprocessMessage";
import {saveMessagePack} from "../repo/saveMessagePack";

setMsgMethod<IImportService>({
	async importReferences(references: IMessage[]): Promise<any> {
		try {
			const packs = await preprocessMessages(references);
			return {
				preResult: {
					msgs: packs.messages.length,
					terms: packs.terms.length,
				},
				saveResult:await saveMessagePack(packs),
			};
		} catch (e) {
			console.error(e)
			throw e;
		}
	},
})

