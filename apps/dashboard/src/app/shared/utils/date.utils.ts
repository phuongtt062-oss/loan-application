import {
  addDays as addDaysFn,
  differenceInCalendarDays,
  endOfDay,
  format as formatDate,
  isFuture as isFutureFn,
  isPast as isPastFn,
  isToday as isTodayFn,
  isValid,
  parseISO,
  startOfDay,
} from 'date-fns';
import { DATE_TIME_SERVER_FORMAT, DDMMYYYY, YYYYMMDD } from '@core/constants/app.constants';
import { Nullable } from '@core/types/app.types';

export type DateInput = Nullable<string | Date | number>;

function isTrimmedEmptyString(value: string): boolean {
  return value.trim() === '';
}

/** `null`, `undefined`, `''`, or whitespace-only string. */
export function isEmptyDate(value: DateInput): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string') {
    return isTrimmedEmptyString(value);
  }
  return false;
}

/** True khi ngày không hợp lệ */
export function isInvalidDate(value: DateInput): boolean {
  if (isEmptyDate(value)) {
    return false;
  }
  return toNativeDate(value) === null;
}

/** True khi ngày hợp lệ */
export function isValidDate(value: DateInput): boolean {
  if (isEmptyDate(value)) {
    return false;
  }
  const d = toNativeDate(value);
  return d !== null && isValid(d);
}

/* Chuyển đổi các đầu vào hợp lệ thành một ngày hợp lệ, hoặc `null` nếu rỗng/không hợp lệ.
 * Chuỗi: thử `parseISO` đầu tiên, sau đó `new Date` (cho timestamp hoặc chuỗi phụ thuộc locale). */
export function toNativeDate(value: DateInput): Date | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return null;
    }
    let parsed = parseISO(trimmed);
    if (!isValid(parsed)) {
      parsed = new Date(trimmed);
    }
    return isValid(parsed) ? parsed : null;
  }
  if (typeof value === 'number') {
    const parsed = new Date(value);
    return isValid(parsed) ? parsed : null;
  }
  return isValid(value) ? value : null;
}

/* Định dạng hiển thị (mặc định `dd/MM/yyyy`). Trả về `''` khi rỗng hoặc không hợp lệ. */
export function format(value: DateInput, pattern: string = DDMMYYYY): string {
  const d = toNativeDate(value);
  if (d === null) {
    return '';
  }
  return formatDate(d, pattern);
}

/* Ngày thông thường REST (`yyyy-MM-dd`). Trả về `''` khi rỗng hoặc không hợp lệ. */
export function formatApi(value: DateInput, pattern: string = YYYYMMDD): string {
  const d = toNativeDate(value);
  if (d === null) {
    return '';
  }
  return formatDate(d, pattern);
}

/* ISO-like payload for APIs (`yyyy-MM-dd'T'HH:mm:ss.SSSxxx`). Trả về `''` khi rỗng hoặc không hợp lệ. */
export function formatApiDateTime(
  value: DateInput,
  pattern: string = DATE_TIME_SERVER_FORMAT,
): string {
  const d = toNativeDate(value);
  if (d === null) {
    return '';
  }
  return formatDate(d, pattern);
}

export function isToday(value: DateInput): boolean {
  const d = toNativeDate(value);
  return d !== null && isTodayFn(d);
}

export function isPast(value: DateInput): boolean {
  const d = toNativeDate(value);
  return d !== null && isPastFn(d);
}

export function isFuture(value: DateInput): boolean {
  const d = toNativeDate(value);
  return d !== null && isFutureFn(d);
}

export function addDays(value: DateInput, amount: number): Date | null {
  const d = toNativeDate(value);
  if (d === null) {
    return null;
  }
  return addDaysFn(d, amount);
}

export function subDays(value: DateInput, amount: number): Date | null {
  return addDays(value, -amount);
}

/* Số ngày giữa 2 ngày */
export function diffInDays(dateLeft: DateInput, dateRight: DateInput): number | null {
  const left = toNativeDate(dateLeft);
  const right = toNativeDate(dateRight);
  if (left === null || right === null) {
    return null;
  }
  return differenceInCalendarDays(startOfDay(left), startOfDay(right));
}

// 00:00:00 - bắt đầu của ngày
export function toStartOfDay(value: DateInput): Date | null {
  const d = toNativeDate(value);
  return d === null ? null : startOfDay(d);
}

// 23:59:59 - kết thúc của ngày
export function toEndOfDay(value: DateInput): Date | null {
  const d = toNativeDate(value);
  return d === null ? null : endOfDay(d);
}
