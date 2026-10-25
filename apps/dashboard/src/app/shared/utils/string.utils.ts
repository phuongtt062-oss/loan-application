import { DEFAULT_NUMBER_LOCALE } from '@core/constants/app.constants';
import { Nullable } from '@core/types/app.types';
import { NBSP } from '@core/constants/app.constants';

const COMBINING_MARK = /\p{M}/gu;

/** Loại bỏ các dấu phụ tiếng Việt/Latinh; giữ nguyên các chữ cái gốc (ASCII nếu có thể). đ/Đ → d/D */
export function removeAccents(input: string): string {
  return input.normalize('NFD').replace(COMBINING_MARK, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

/** So khớp không phân biệt hoa/thường và dấu; needle rỗng → luôn true (kiểu filter “không gõ gì”) */
export function searchMatch(haystack: Nullable<string>, needle: Nullable<string>): boolean {
  if (needle === null || needle === undefined || needle.trim() === '') {
    return true;
  }
  if (haystack === null || haystack === undefined) {
    return false;
  }
  const h = removeAccents(haystack.toLocaleLowerCase(DEFAULT_NUMBER_LOCALE));
  const n = removeAccents(needle.toLocaleLowerCase(DEFAULT_NUMBER_LOCALE));
  return h.includes(n);
}
/** equalsNormalized('Hà Nội', 'Nội') → false.
 * searchMatch('Hà Nội', 'Nội') → true */

/** True khi so sánh bằng bình thường (không phân biệt hoa/thường và dấu). */
export function equalsNormalized(a: Nullable<string>, b: Nullable<string>): boolean {
  return normalizeForSearch(a) === normalizeForSearch(b);
}

/** Same normalization as {@link searchMatch} but returns comparable strings for sorting/grouping. */
export function normalizeForSearch(input: Nullable<string>): string {
  if (input === null || input === undefined) {
    return '';
  }
  return removeAccents(input.toLocaleLowerCase(DEFAULT_NUMBER_LOCALE)).trim();
}

/** Cắt theo code point Unicode, có suffix (mặc định …) */
export function truncate(value: string, maxLength: number, suffix = '…'): string {
  if (maxLength <= 0) {
    return '';
  }
  const chars = [...value];
  if (chars.length <= maxLength) {
    return value;
  }
  const suf = [...suffix];
  const take = maxLength - suf.length;
  if (take <= 0) {
    return suf.slice(0, maxLength).join('');
  }
  return chars.slice(0, take).join('') + suffix;
}

/** Cụm chữ cái đầu tiên viết hoa, các cụm còn lại viết thường. */
export function capitalize(value: string, locale: string = DEFAULT_NUMBER_LOCALE): string {
  const t = value.trim();
  if (t === '') {
    return '';
  }
  const chars = [...t];
  const first = chars[0]!.toLocaleUpperCase(locale);
  const rest = chars.slice(1).join('').toLocaleLowerCase(locale);
  return `${first}${rest}`;
}

/** Viết hoa chữ cái đầu tiên của mỗi từ được phân tách bằng khoảng trắng. */
export function capitalizeWords(value: string, locale: string = DEFAULT_NUMBER_LOCALE): string {
  return trimAll(value)
    .split(/\s+/)
    .map((word) => capitalize(word, locale))
    .join(' ');
}

/** Suy ra tên hiển thị từ email local-part (vd: `nguyen.van-a@x.com` -> `Nguyen Van A`). */
export function displayNameFromEmail(email: string): string {
  const localPart = email.split('@')[0]?.trim() ?? email;
  const words = localPart.split(/[._\s-]+/).filter(Boolean);
  if (words.length === 0) {
    return trimAll(email);
  }
  return words.map((word) => capitalize(word)).join(' ');
}

/** Chuỗi URL: bỏ dấu, lowercase, ký tự lạ → - */
export function slugify(value: string): string {
  return removeAccents(value.toLocaleLowerCase(DEFAULT_NUMBER_LOCALE))
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** NBSP → space, rút gọn các chạy khoảng trắng, cắt đầu cuối. */
export function trimAll(value: string): string {
  return value.replace(NBSP, ' ').replace(/\s+/g, ' ').trim();
}

/** Chữ cái đầu tiên từ các từ được phân tách bằng khoảng trắng (Unicode-aware first char). */
export function getInitials(value: Nullable<string>, maxChars = 2): string {
  if (!isNotEmpty(value)) {
    return '';
  }
  const initials = trimAll(value)
    .split(/\s+/)
    .map((part) => [...part][0])
    .filter((ch): ch is string => !!ch && /\S/u.test(ch))
    .map((ch) => ch.toLocaleUpperCase(DEFAULT_NUMBER_LOCALE))
    .slice(0, Math.max(0, maxChars));
  return initials.join('');
}

export function isEmpty(value: Nullable<string>): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  return value.trim() === '';
}

export function isNotEmpty(value: Nullable<string>): value is string {
  return !isEmpty(value);
}


