import {IStoreSchema} from "gs-idb-pro";

export const MessageStoreName = 'message'

export const messageSchema: IStoreSchema = {
	name: MessageStoreName,
	addedTimeField: {
		name: 'added_at',
		isIndexed: false
	},
	updatedTimeField: {
		name: 'updated_at',
		isIndexed: false
	},
	updatedCountField: true,
	softDeletedField: 'deleted',
	indexSchemas: [
		'hash',
		{
			name: 'is_reference_deleted',
			keyPath: ['is_reference', 'deleted'],
		},
		{
			name: 'is_content_deleted',
			keyPath: ['is_content', 'deleted'],
		},
	]
}
