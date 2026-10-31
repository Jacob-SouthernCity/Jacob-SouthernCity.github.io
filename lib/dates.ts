import type { YearMonth } from "./content/schema";
import type { Locale } from "./i18n/config";
import { messages } from "./i18n/messages";

const ENGLISH_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

export function toMonthIndex(yearMonth: YearMonth) {
  const [year, month] = yearMonth.split("-").map(Number);
  return year * 12 + month - 1;
}

export function monthLabel(monthOfYear: number, locale: Locale) {
  return locale === "en" ? ENGLISH_MONTHS[monthOfYear] : `${monthOfYear + 1}月`;
}

function formatYearMonth(yearMonth: YearMonth, locale: Locale) {
  const [year, month] = yearMonth.split("-").map(Number);
  return locale === "en" ? `${ENGLISH_MONTHS[month - 1]} ${year}` : `${year}年${month}月`;
}

export function formatDateRange(start: YearMonth, end: YearMonth | null, locale: Locale) {
  if (end === start) return formatYearMonth(start, locale);
  return `${formatYearMonth(start, locale)} – ${end ? formatYearMonth(end, locale) : messages[locale].dates.present}`;
}
