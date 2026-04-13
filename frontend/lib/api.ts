import { getMiniProgramSeatData, searchSeatsLocal } from "./search-core.js";

export interface SeatResult {
  name: string;
  organization: string;
  display_name: string;
  zone: string;
  row: number;
  seat: number;
}

type DataSource = "api" | "local";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const DATA_SOURCE = resolveDataSource(process.env.NEXT_PUBLIC_SEAT_DATA_SOURCE);

export async function searchSeats(name: string): Promise<SeatResult[]> {
  if (DATA_SOURCE === "local") {
    return searchSeatsLocal(name) as SeatResult[];
  }

  const response = await fetch(`${API_BASE_URL}/api/seat?name=${encodeURIComponent(name)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new Error(message);
  }

  return (await response.json()) as SeatResult[];
}

export function searchSeatsSync(name: string): SeatResult[] {
  return searchSeatsLocal(name) as SeatResult[];
}

export function getMiniProgramSeats() {
  return getMiniProgramSeatData();
}

export function getSeatDataSource(): DataSource {
  return DATA_SOURCE;
}

function resolveDataSource(value: string | undefined): DataSource {
  return value === "local" ? "local" : "api";
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { error?: string };
    if (payload.error) {
      return payload.error;
    }
  } catch {
    return "服务暂时不可用，请稍后重试。";
  }

  return "服务暂时不可用，请稍后重试。";
}
