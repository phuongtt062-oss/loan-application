import { Pipe, PipeTransform } from '@angular/core';
import { format, isValid, parseISO } from 'date-fns';
import { Nullable } from '@core/types/app.types';
import { DDMMYYYY } from '@core/constants/app.constants';

@Pipe({
    name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
    /**
     * @param value date (ISO string or Date object)
     * @param formatStr date-fns use 'dd/MM/yyyy', not 'DD/MM/YYYY'
     */
    transform(value: Nullable<string | Date>, formatStr: string = DDMMYYYY): string {
        if (!value) {
            return '';
        }

        let date: Date;

        if (typeof value === 'string') {
            // = moment.utc()
            date = parseISO(value);
        } else {
            date = new Date(value);
        }

        if (!isValid(date)) {
            return '';
        }

        return format(date, formatStr);
    }
}
