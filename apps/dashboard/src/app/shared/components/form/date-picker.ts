import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { createFormFieldId } from '../../utils/form.utils';

@Component({
  selector: 'app-form-date-picker',
  imports: [CommonModule, FormsModule, DatePickerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormDatePicker),
      multi: true,
    },
  ],
  template: `
    <div class="flex w-full flex-col gap-1">
      @if (label()) {
        <label [attr.for]="controlId()" class="text-color text-sm font-medium">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500" aria-hidden="true">*</span>
          }
        </label>
      }
      <p-datepicker
        [inputId]="controlId()"
        [showIcon]="showIcon()"
        [showButtonBar]="showButtonBar()"
        [disabled]="isDisabled()"
        [dateFormat]="dateFormat()"
        [placeholder]="placeholder()"
        [ngModel]="value()"
        (ngModelChange)="onModelChange($event)"
        (onBlur)="onBlur()"
        [class.ng-invalid]="showErrorState()"
        [class.ng-dirty]="showErrorState()"
        class="w-full"
        [style]="{ width: '100%' }"
      />
      @if (errorMessage()) {
        <small class="text-red-500">{{ errorMessage() }}</small>
      } @else if (hint()) {
        <small class="text-muted-color">{{ hint() }}</small>
      }
    </div>
  `,
})
export class FormDatePicker implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  readonly placeholder = input<string>('');
  readonly inputId = input<string | undefined>(undefined);
  readonly required = input(false);
  readonly invalid = input(false);
  readonly showIcon = input(true);
  readonly showButtonBar = input(false);
  readonly dateFormat = input<string | undefined>(undefined);
  readonly appendTo = input<string | HTMLElement | null | undefined>(undefined);

  readonly controlId = computed(
    () => this.inputId() ?? this.generatedId,
  );

  protected readonly value = signal<Date | Date[] | null>(null);
  protected readonly isDisabled = signal(false);
  protected readonly touched = signal(false);

  private readonly generatedId = createFormFieldId('form-date');

  private onChange: (v: Date | Date[] | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected showErrorState = computed(
    () => this.invalid() || (!!this.errorMessage() && this.touched()),
  );

  writeValue(value: Date | Date[] | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (v: Date | Date[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected onModelChange(next: Date | Date[] | null): void {
    this.value.set(next);
    this.onChange(next);
  }

  protected onBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }
}
