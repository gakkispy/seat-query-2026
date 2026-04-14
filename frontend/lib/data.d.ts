export interface RawSeatDataItem {
	name: string;
	org: string;
	area: string;
	row: string;
	seat: string;
}

declare const NEW_DATA: RawSeatDataItem[];

export { NEW_DATA };

export default NEW_DATA;
