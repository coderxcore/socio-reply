export function findLongest(arr: string[]): string {
	if(arr.length<2) {
		return arr[0];
	}
	let longest = "";
	for (let i = 0; i < arr.length; i++) {
		const s = arr[i];
		if (s.length > longest.length) {
			longest = s;
		}
	}
	return longest;
}
