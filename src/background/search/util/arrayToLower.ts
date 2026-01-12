export function arrayToLower(arr: string[]): string[] {
	for (let i = 0, len = arr.length; i < len; i++) {
		arr[i] = arr[i].toLowerCase();
	}
	return arr;
}
