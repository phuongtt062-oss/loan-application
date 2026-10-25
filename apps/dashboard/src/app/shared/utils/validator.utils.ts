import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { toNativeDate } from '@shared/utils/date.utils';
import { EMAIL_REGEX, PHONE_NUMBER_REGEX } from '@core/constants/app.constants';

/** True khi email hợp lệ */
export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

/** True khi số điện thoại hợp lệ */
export function isValidPhone(value: string): boolean {
  return PHONE_NUMBER_REGEX.test(value.trim());
}

/** True khi mật khẩu mạnh */
export function isStrongPassword(value: string): boolean {
  const hasUppercase = /[A-Z]/u.test(value);
  const hasLowercase = /[a-z]/u.test(value);
  const hasNumber = /\d/u.test(value);
  const hasMinLength = value.length >= 8;
  return hasUppercase && hasLowercase && hasNumber && hasMinLength;
}

/** Validator cho email */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const { value } = control;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const str = String(value);
    return isValidEmail(str) ? null : { email: value };
  };
}

/** Validator cho số điện thoại */
export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const str = String(value).trim();
    return isValidPhone(str) ? null : { phoneNumber: true };
  };
}

/** Validator cho mật khẩu mạnh */
export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '') as string;
    if (!value) {
      return null;
    }
    return isStrongPassword(value) ? null : { strongPassword: true };
  };
}

/** Validator cho xác nhận mật khẩu */
export function matchPasswordValidator(passwordFieldName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) {
      return null;
    }
    const passwordCtrl = parent.get(passwordFieldName);
    const confirm = control.value ?? '';
    const password = passwordCtrl?.value ?? '';
    if (confirm === '' && password === '') {
      return null;
    }
    return password === confirm ? null : { matchPassword: true };
  };
}

export interface DateRangeValidatorOptions {
  /** Control chứa ngày bắt đầu (mặc định `start`). */
  startKey?: string;
  /** Control chứa ngày kết thúc (mặc định `end`). */
  endKey?: string;
}

/** Validator cho ngày bắt đầu và ngày kết thúc, start phải ≤ end, rỗng một bên thì bỏ qua (để Validators.required xử lý). */
export function dateRangeValidator(options: DateRangeValidatorOptions = {}): ValidatorFn {
  const startKey = options.startKey ?? 'start';
  const endKey = options.endKey ?? 'end';

  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) {
      return null;
    }
    const startVal = control.get(startKey)?.value;
    const endVal = control.get(endKey)?.value;
    if (startVal === null || startVal === undefined || startVal === '') {
      return null;
    }
    if (endVal === null || endVal === undefined || endVal === '') {
      return null;
    }
    const start = toNativeDate(startVal);
    const end = toNativeDate(endVal);
    if (start === null || end === null) {
      return { dateRange: { invalid: true } };
    }
    if (start.getTime() > end.getTime()) {
      return { dateRange: { startKey, endKey } };
    }
    return null;
  };
}

/** Lỗi nếu chuỗi chứa bất kỳ ký tự khoảng trắng nào (space, tab, xuống dòng, NBSP, v.v.). */
export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const str = String(value);
    return /\s/u.test(str) ? { noWhitespace: true } : null;
  };
}
