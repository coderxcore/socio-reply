import {IStoreSchema} from "gs-idb-pro";

export const DraftStoreName = 'draft'

export const draftSchema: IStoreSchema = {
	name: DraftStoreName,
	addedTimeField: {
		name: 'added_at',
		isIndexed:false
	},
	updatedTimeField: {
		name: 'updated_at',
		isIndexed:false
	},
	indexSchemas: [
		'scope',
	]
}
