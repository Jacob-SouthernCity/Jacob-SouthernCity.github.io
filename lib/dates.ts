import type { YearMonth } from "./types";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

export function toMonthIndex(yearMonth: YearMonth) {
  const [year, month] = yearMonth.split("-").map(Number);
  return year * 12 + month - 1;
}

export function monthLabel(monthOfYear: number) {
  return MONTH_NAMES[monthOfYear];
}

export function formatYearMonth(yearMonth: YearMonth) {
  const [year, month] = yearMonth.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

export function formatDateRange(start: YearMonth, end: YearMonth | null) {
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : "Present"}`;
}
