import { Nullable } from '@core/types/app.types';
import { DEFAULT_NUMBER_LOCALE } from '@core/constants/app.constants';
import { NBSP } from '@core/constants/app.constants';

function stripSpacesAndNbsp(value: string): string {
  return value.replace(NBSP, ' ').replace(/\s/g, '').trim();
}

/** Loại bỏ các suffix/ký tự đặc biệt tiền tệ trước khi phân tích. */
function stripCurrencyNoise(value: string): string {
  return value.replace(/₫|đ|vnd/gi, '').trim();
}

/**
 * Phân tích các số được nhóm / định dạng theo locale (`1.234.567`, `1.234,56`, `1,234.56`, `12,5`).
 * Khi cả `.` và `,` tồn tại, dấu phân cách bên phải sẽ được coi là dấu thập phân.
 */
export function parseLocalNumber(input: Nullable<string | number>): number | null {
  if (input === null || input === undefined) {
    return null;
  }
  if (typeof input === 'number') {
    return Number.isFinite(input) ? input : null;
  }

  const s = stripCurrencyNoise(stripSpacesAndNbsp(input));
  if (s === '') {
    return null;
  }

  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');

  if (lastComma !== -1 && lastDot !== -1) {
    if (lastComma > lastDot) {
      const intRaw = s.slice(0, lastComma).replace(/\./g, '');
      const frac = s.slice(lastComma + 1).replace(/[.,]/g, '');
      const n = Number(`${intRaw}.${frac}`);
      return Number.isFinite(n) ? n : null;
    }
    const intRaw = s.slice(0, lastDot).replace(/,/g, '');
    const frac = s.slice(lastDot + 1).replace(/,/g, '');
    const n = Number(`${intRaw}.${frac}`);
    return Number.isFinite(n) ? n : null;
  }

  if (lastComma !== -1 && lastDot === -1) {
    const commaCount = (s.match(/,/g) ?? []).length;
    if (commaCount === 1) {
      const [a, b] = s.split(',');
      if (b.length <= 2) {
        const n = Number(`${a.replace(/\./g, '')}.${b}`);
        return Number.isFinite(n) ? n : null;
      }
    }
    const n = Number(s.replace(/,/g, ''));
    return Number.isFinite(n) ? n : null;
  }

  if (lastDot !== -1 && lastComma === -1) {
    const dotCount = (s.match(/\./g) ?? []).length;
    if (dotCount > 1) {
      const n = Number(s.replace(/\./g, ''));
      return Number.isFinite(n) ? n : null;
    }
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/* Chuyển đổi các đầu vào thành số hữu hạn, hoặc `null`.
 * Chuỗi đi qua {@link parseLocalNumber} để phân tích đúng các số được nhóm / định dạng theo locale. */
export function toNumber(value: Nullable<string | number>): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  const trimmed = value.trim();
  if (trimmed === '') {
    return null;
  }
  return parseLocalNumber(trimmed);
}

/** True khi số là số */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/** True khi số lớn hơn 0 */
export function isPositive(value: unknown): boolean {
  return isNumber(value) && value > 0;
}

/** True khi số là số nguyên */
export function isInteger(value: unknown): boolean {
  if (!isNumber(value)) {
    return false;
  }
  return Number.isInteger(value);
}

/** Làm tròn đến `decimals` chữ số thập phân (`decimals` có thể âm, ví dụ `-2` → trăm). */
export function roundTo(value: number, decimals: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(decimals)) {
    return NaN;
  }
  const m = 10 ** decimals;
  return Math.round((value + Number.EPSILON * Math.sign(value)) * m) / m;
}

/** `(part / whole) * 100`, hoặc `null` khi `whole` là `0` hoặc đầu vào không hữu hạn. */
export function calculatePercent(part: number, whole: number): number | null {
  if (!isNumber(part) || !isNumber(whole) || whole === 0) {
    return null;
  }
  return (part / whole) * 100;
}

// Giới hạn một giá trị trong khoảng min-max
export function clamp(value: number, min: number, max: number): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return Math.min(Math.max(value, lo), hi);
}

let vndFormatter: Intl.NumberFormat | null = null;

function getVndFormatter(): Intl.NumberFormat {
  vndFormatter ??= new Intl.NumberFormat(DEFAULT_NUMBER_LOCALE, {
    style: 'currency',
    currency: 'VND',
    currencyDisplay: 'symbol',
    maximumFractionDigits: 0,
  });
  return vndFormatter;
}

/** Định dạng VND (`vi-VN`), `0` chữ số thập phân. Rỗng / không hữu hạn → `''`. */
export function formatVnd(value: Nullable<number>): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '';
  }
  return getVndFormatter().format(value);
}

let defaultNumberFormatter: Intl.NumberFormat | null = null;

function getDefaultNumberFormatter(): Intl.NumberFormat {
  defaultNumberFormatter ??= new Intl.NumberFormat(DEFAULT_NUMBER_LOCALE, {
    maximumFractionDigits: 20,
  });
  return defaultNumberFormatter;
}

/** Số được nhóm trong `vi-VN` mặc định; ghi đè qua `locale` / `options`. */
export function formatNumber(
  value: Nullable<number>,
  options?: Intl.NumberFormatOptions,
  locale: string = DEFAULT_NUMBER_LOCALE,
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '';
  }
  if (options === undefined && locale === DEFAULT_NUMBER_LOCALE) {
    return getDefaultNumberFormatter().format(value);
  }
  return new Intl.NumberFormat(locale, options).format(value);
}

let defaultPercentFormatter: Intl.NumberFormat | null = null;

function getDefaultPercentFormatter(): Intl.NumberFormat {
  defaultPercentFormatter ??= new Intl.NumberFormat(DEFAULT_NUMBER_LOCALE, {
    style: 'percent',
    maximumFractionDigits: 2,
  });
  return defaultPercentFormatter;
}

/** `Intl` percent (`0.25` → `25%`). Truyền tỷ lệ, không phải giá trị nhân 100. Rỗng / không hữu hạn → `''`. */
export function formatPercent(
  value: Nullable<number>,
  options?: Intl.NumberFormatOptions,
  locale: string = DEFAULT_NUMBER_LOCALE,
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '';
  }
  if (options === undefined && locale === DEFAULT_NUMBER_LOCALE) {
    return getDefaultPercentFormatter().format(value);
  }
  return new Intl.NumberFormat(locale, { style: 'percent', ...options }).format(value);
}
