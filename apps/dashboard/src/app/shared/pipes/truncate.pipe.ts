import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, maxLength = 50, suffix = '…'): string {
    if (value == null || value === '') {
      return '';
    }
    if (value.length <= maxLength) {
      return value;
    }
    const end = Math.max(0, maxLength - suffix.length);
    return value.slice(0, end) + suffix;
  }
}
