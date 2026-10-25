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
import { CheckboxModule } from 'primeng/checkbox';
import { createFormFieldId } from '../../utils/form.utils';

@Component({
  selector: 'app-form-checkbox',
  imports: [CommonModule, FormsModule, CheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCheckbox),
      multi: true,
    },
  ],
  template: `
    <div class="flex w-full flex-col gap-1">
      <div class="flex items-center gap-2">
        <p-checkbox
          [inputId]="controlId()"
          [binary]="true"
          [name]="name()"
          [disabled]="isDisabled()"
          [ngModel]="value()"
          (ngModelChange)="onModelChange($event)"
          (onBlur)="onBlur()"
          [class.ng-invalid]="showErrorState()"
          [class.ng-dirty]="showErrorState()"
        />
        @if (label()) {
          <label [for]="controlId()" class="text-color cursor-pointer text-sm leading-none">
            {{ label() }}
            @if (required()) {
              <span class="text-red-500" aria-hidden="true">*</span>
            }
          </label>
        }
      </div>
      @if (errorMessage()) {
        <small class="text-red-500">{{ errorMessage() }}</small>
      } @else if (hint()) {
        <small class="text-muted-color">{{ hint() }}</small>
      }
    </div>
  `,
})
export class FormCheckbox implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  readonly name = input<string>('');
  readonly inputId = input<string | undefined>(undefined);
  readonly required = input(false);
  readonly invalid = input(false);

  readonly controlId = computed(
    () => this.inputId() ?? this.generatedId,
  );

  protected readonly value = signal(false);
  protected readonly isDisabled = signal(false);
  protected readonly touched = signal(false);

  private readonly generatedId = createFormFieldId('form-checkbox');

  private onChange: (v: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected showErrorState = computed(
    () => this.invalid() || (!!this.errorMessage() && this.touched()),
  );

  writeValue(value: boolean | null): void {
    this.value.set(!!value);
  }

  registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected onModelChange(next: boolean): void {
    this.value.set(next);
    this.onChange(next);
  }

  protected onBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }
}
