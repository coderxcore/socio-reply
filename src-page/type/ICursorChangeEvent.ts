export interface IChangeRange {
	start: number
	end: number
}

export interface ICursorChangeEvent extends IChangeRange {
	editText: string
}
