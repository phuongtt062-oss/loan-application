import { Pipe, PipeTransform } from '@angular/core';
import { format, isValid, parseISO } from 'date-fns';
import { Nullable } from '@core/types/app.types';

@Pipe({
    name: 'dateTimeFormat',
})
export class DateTimeFormatPipe implements PipeTransform {
    transform(value: Nullable<Date | string>, formatStr: string): string {
        if (!value) {
            return '';
        }

        let date: Date;

        if (typeof value === 'string') {
            date = parseISO(value);
        } else {
            date = new Date(value);
        }

        if (!isValid(date)) {
            return '';
        }

        const result = format(date, formatStr);

        return result.charAt(0).toUpperCase() + result.slice(1);
    }
}
