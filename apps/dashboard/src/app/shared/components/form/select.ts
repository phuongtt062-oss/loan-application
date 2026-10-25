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
import { SelectModule } from 'primeng/select';
import { createFormFieldId } from '../../utils/form.utils';

@Component({
  selector: 'app-form-select',
  imports: [CommonModule, FormsModule, SelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelect),
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
      <p-select
        [inputId]="controlId()"
        [options]="options()"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        [optionDisabled]="optionDisabled()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        [filter]="filter()"
        [showClear]="showClear()"
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
export class FormSelect<T = unknown> implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  readonly placeholder = input<string>('');
  readonly options = input<T[]>([]);
  readonly optionLabel = input<string | undefined>(undefined);
  readonly optionValue = input<string | undefined>(undefined);
  readonly optionDisabled = input<string | undefined>(undefined);
  readonly filter = input(false);
  readonly showClear = input(false);
  readonly appendTo = input<string | HTMLElement | null | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);
  readonly required = input(false);
  readonly invalid = input(false);

  readonly controlId = computed(
    () => this.inputId() ?? this.generatedId,
  );

  protected readonly value = signal<T | null>(null);
  protected readonly isDisabled = signal(false);
  protected readonly touched = signal(false);

  private readonly generatedId = createFormFieldId('form-select');

  private onChange: (v: T | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected showErrorState = computed(
    () => this.invalid() || (!!this.errorMessage() && this.touched()),
  );

  writeValue(value: T | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (v: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected onModelChange(next: T | null): void {
    this.value.set(next);
    this.onChange(next);
  }

  protected onBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }
}
