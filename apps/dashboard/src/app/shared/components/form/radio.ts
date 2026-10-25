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
import { RadioButtonModule } from 'primeng/radiobutton';
import { createFormFieldId } from '../../utils/form.utils';

@Component({
  selector: 'app-form-radio',
  imports: [CommonModule, FormsModule, RadioButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormRadio),
      multi: true,
    },
  ],
  template: `
    <div class="flex w-full flex-col gap-1">
      <div class="flex items-center gap-2">
        <p-radiobutton
          [inputId]="controlId()"
          [name]="name()"
          [value]="optionValue()"
          [disabled]="isDisabled()"
          [ngModel]="selected()"
          (ngModelChange)="onModelChange($event)"
          (onBlur)="onBlur()"
          [class.ng-invalid]="showErrorState()"
          [class.ng-dirty]="showErrorState()"
        />
        @if (label()) {
          <label [for]="controlId()" class="text-color cursor-pointer text-sm leading-none">
            {{ label() }}
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
export class FormRadio<T = unknown> implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  readonly name = input<string>('');
  readonly optionValue = input.required<T>();
  readonly inputId = input<string | undefined>(undefined);
  readonly invalid = input(false);

  readonly controlId = computed(
    () => this.inputId() ?? this.generatedId,
  );

  protected readonly selected = signal<T | null>(null);
  protected readonly isDisabled = signal(false);
  protected readonly touched = signal(false);

  private readonly generatedId = createFormFieldId('form-radio');

  private onChange: (v: T | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected showErrorState = computed(
    () => this.invalid() || (!!this.errorMessage() && this.touched()),
  );

  writeValue(value: T | null): void {
    this.selected.set(value);
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
    this.selected.set(next);
    this.onChange(next);
  }

  protected onBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }
}
