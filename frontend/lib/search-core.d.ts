export interface SeatRecord {
  name: string;
  organization: string;
  display_name: string;
  zone: string;
  row: number;
  seat: number;
}

export function getSeatRecords(): SeatRecord[];
export function searchSeatsLocal(keyword: string): SeatRecord[];
export function getMiniProgramSeatData(): Array<{
  id: number;
  title: string;
  subtitle: string;
  zone: string;
  row: string;
  seat: string;
  location_text: string;
}>;
export function searchSeatsForMiniProgram(keyword: string): Array<{
  id: number;
  title: string;
  subtitle: string;
  zone: string;
  row: string;
  seat: string;
  location_text: string;
}>;
