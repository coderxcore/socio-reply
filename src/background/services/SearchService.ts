import {setMsgMethod} from "gs-br-ext";
import {IMessage, ISearchService, ITerm} from "/src-com";
import {Search} from "../search/Search";

setMsgMethod<ISearchService>({
	searchMsg(text: string): Promise<IMessage[]> {
		return Search.searchMsg(text) as any;
	}, searchTerm(text: string): Promise<ITerm[]> {
		return Search.searchTerm(text) as any;
	}

});
