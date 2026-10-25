export const DDMMYYYY = 'dd/MM/yyyy';
export const YYYYMMDD = 'yyyy-MM-dd';
export const YYYYMMDD_HHmm = 'yyyy-MM-dd HH:mm';
export const DDMMYYYY_HHMM = 'dd/MM/yyyy - HH:mm';
export const DATE_TIME_SERVER_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";
export const LOCALE_DATE_FORMAT = 'eeee, dd MMM, yyyy';
export const HHmm = 'HH:mm';

export const DEFAULT_NUMBER_LOCALE = 'vi-VN';

export const NBSP = /[\u00A0\u202F]/g; // non-breaking space
export const EMAIL_REGEX = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/u;
export const PHONE_NUMBER_REGEX = /^(?:\+?84|0)(?:3|5|7|8|9)\d{8}$/u;

export enum LANGUAGE {
    VI = 'vi',
    EN = 'en',
}

export const API_PATHS = {
  AUTH: 'auth',
  LOGIN: 'login',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  NATIONAL_ID: 'national_id',
  PHONE_NUMBER: 'phone_number',
  TRANSACTION_ID: 'transaction_id',
  APPLICATION_ID: 'application_id',
  SELECTED_OFFER: 'selected_offer',
  APPLICATION_STATUS: 'application_status',
  STATUS_LABEL: 'status_label',
} as const;


export const APP_ROUTES = {
  ROOT: '',
  NOT_FOUND: 'notfound',
  ACCESS_DENIED: 'access',
  AUTH: 'auth',
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
} as const;