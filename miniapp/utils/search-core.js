const SEAT_DATA = require("./data");

const ORGANIZATIONS = [
  "省政府办公厅",
  "省发展改革委",
  "省教育厅",
  "省科技厅",
  "省工业和信息化厅",
  "省公安厅",
  "省民政厅",
  "省财政厅",
  "省人力资源和社会保障厅",
  "省住房城乡建设厅",
  "省交通运输厅",
  "省农业农村厅",
  "省商务厅",
  "省文化和旅游厅",
  "省卫生健康委",
  "省国资委",
  "省市场监管局",
  "省数据局",
  "开幕式筹备组",
  "嘉宾接待组"
];

const ROW_LABEL_TO_NUMBER = {
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
  十一: 11,
  十二: 12,
  十三: 13,
  十四: 14,
  十五: 15,
  十六: 16,
  十七: 17,
  十八: 18,
  十九: 19,
  二十: 20
};

const MAX_RESULT_COUNT = 60;

function parseSeatLabel(seatLabel) {
  const match = /^([A-Z])区([一二三四五六七八九十]{1,3})排(\d+)座$/.exec(seatLabel);
  if (!match) {
    return null;
  }

  const zoneCode = match[1];
  const rowLabel = match[2];
  const seat = Number.parseInt(match[3], 10);
  const row = ROW_LABEL_TO_NUMBER[rowLabel];
  if (!row) {
    return null;
  }

  return {
    zone: `${zoneCode}区`,
    row,
    seat
  };
}

function buildOrganization(index) {
  const prefix = ORGANIZATIONS[index % ORGANIZATIONS.length];
  const group = Math.floor(index / ORGANIZATIONS.length) + 1;
  return `${prefix}${group}组`;
}

function normalizeKeyword(value) {
  return (value || "").trim().toLowerCase();
}

function scoreRecord(record, keyword) {
  const name = record.name.toLowerCase();
  const displayName = record.display_name.toLowerCase();
  const organization = record.organization.toLowerCase();

  if (name === keyword) return 500;
  if (displayName === keyword) return 450;
  if (name.startsWith(keyword)) return 320;
  if (displayName.startsWith(keyword)) return 280;
  if (name.includes(keyword)) return 220;
  if (displayName.includes(keyword)) return 200;
  if (organization.includes(keyword)) return 120;
  return -1;
}

const seatRecords = Object.entries(SEAT_DATA)
  .map(([name, seatLabel], index) => {
    const parsed = parseSeatLabel(seatLabel);
    if (!parsed) {
      return null;
    }

    const organization = buildOrganization(index);
    return {
      id: index + 1,
      name,
      organization,
      display_name: name,
      zone: parsed.zone,
      row: parsed.row,
      seat: parsed.seat,
      location_text: `${parsed.zone}${parsed.row}排${parsed.seat}座`
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

function searchSeatsForMiniProgram(keyword) {
  const normalizedKeyword = normalizeKeyword(keyword);
  if (!normalizedKeyword) {
    return [];
  }

  return seatRecords
    .map((record) => ({ record, score: scoreRecord(record, normalizedKeyword) }))
    .filter((item) => item.score >= 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, MAX_RESULT_COUNT)
    .map((item) => ({
      id: item.record.id,
      title: item.record.display_name,
      subtitle: item.record.organization,
      zone: item.record.zone,
      row: `${item.record.row}排`,
      seat: `${item.record.seat}座`,
      location_text: item.record.location_text
    }));
}

function getAllSeatData() {
  return seatRecords.map((record) => ({
    id: record.id,
    title: record.display_name,
    subtitle: record.organization,
    zone: record.zone,
    row: `${record.row}排`,
    seat: `${record.seat}座`,
    location_text: record.location_text
  }));
}

module.exports = {
  getAllSeatData,
  searchSeatsForMiniProgram
};
