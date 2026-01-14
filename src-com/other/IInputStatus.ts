export interface IInputStatus {

	tabId?: number;

	/**
	 * 只包含 `host与 `path`
	 */
	url: string;

	title?: string;

	currentInput?: string;

	mainContent?: string;

	/**
	 * 是否可写
	 */
	writable?: boolean;

}
