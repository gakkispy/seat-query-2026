import NEW_DATA from "./data.js";



const MAX_RESULT_COUNT = 60;


function parseSeatValue(seatValue) {
  const normalized = String(seatValue ?? "").trim().replace(/座$/, "");
  if (!normalized || !/^\d+$/.test(normalized)) {
    return null;
  }

  return Number.parseInt(normalized, 10);
}

function buildSeatRecords() {
  return NEW_DATA
    .map((item) => {
      const name = String(item.name ?? "").trim();
      const organization = String(item.org ?? "").trim();
      const zone = String(item.area ?? "").trim();
      const row = item.row;
      const seat = parseSeatValue(item.seat);

      if (!name || !zone || row === null || seat === null) {
        return null;
      }

      return {
        name,
        organization,
        display_name: organization ? `${name}(${organization})` : name,
        zone,
        row,
        seat,
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      return (
        left.zone.localeCompare(right.zone, "zh-CN") ||
        left.row - right.row ||
        left.seat - right.seat ||
        left.display_name.localeCompare(right.display_name, "zh-CN")
      );
    });
}

function normalizeKeyword(value) {
  return value.trim().toLocaleLowerCase();
}

function scoreRecord(record, keyword) {
  const name = record.name.toLocaleLowerCase();
  const displayName = record.display_name.toLocaleLowerCase();
  const organization = record.organization.toLocaleLowerCase();

  if (name === keyword) {
    return 500;
  }
  if (displayName === keyword) {
    return 450;
  }
  if (name.startsWith(keyword)) {
    return 320;
  }
  if (displayName.startsWith(keyword)) {
    return 280;
  }
  if (name.includes(keyword)) {
    return 220;
  }
  if (displayName.includes(keyword)) {
    return 200;
  }
  if (organization.includes(keyword)) {
    return 120;
  }

  return -1;
}

const SEAT_RECORDS = buildSeatRecords();

export function getSeatRecords() {
  return SEAT_RECORDS;
}

export function searchSeatsLocal(keyword) {
  const normalizedKeyword = normalizeKeyword(keyword);
  if (!normalizedKeyword) {
    return [];
  }

  return SEAT_RECORDS
    .map((record) => ({ record, score: scoreRecord(record, normalizedKeyword) }))
    .filter((item) => item.score >= 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, MAX_RESULT_COUNT)
    .map((item) => item.record);
}

export function getMiniProgramSeatData() {
  return SEAT_RECORDS.map((record, index) => ({
    id: index + 1,
    title: record.display_name,
    subtitle: record.organization,
    zone: record.zone,
    row: `${record.row}排`,
    seat: `${record.seat}座`,
    location_text: `${record.zone}${record.row}排${record.seat}座`,
  }));
}

export function searchSeatsForMiniProgram(keyword) {
  return searchSeatsLocal(keyword).map((record, index) => ({
    id: index + 1,
    title: record.display_name,
    subtitle: record.organization,
    zone: record.zone,
    row: `${record.row}排`,
    seat: `${record.seat}座`,
    location_text: `${record.zone}${record.row}排${record.seat}座`,
  }));
}
