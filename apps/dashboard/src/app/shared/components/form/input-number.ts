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
import { InputNumberModule } from 'primeng/inputnumber';
import { createFormFieldId } from '../../utils/form.utils';

@Component({
  selector: 'app-form-input-number',
  imports: [CommonModule, FormsModule, InputNumberModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputNumber),
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
      <p-inputnumber
        [inputId]="controlId()"
        [name]="name()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        [min]="min()"
        [max]="max()"
        [mode]="mode()"
        [minFractionDigits]="minFractionDigits()"
        [maxFractionDigits]="maxFractionDigits()"
        [showButtons]="showButtons()"
        [ngModel]="value()"
        (ngModelChange)="onModelChange($event)"
        (onBlur)="onBlurFn()"
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
export class FormInputNumber implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  readonly placeholder = input<string>('');
  readonly name = input<string>('');
  readonly inputId = input<string | undefined>(undefined);
  readonly required = input(false);
  readonly invalid = input(false);
  readonly min = input<number | undefined>(undefined);
  readonly max = input<number | undefined>(undefined);
  readonly mode = input<'decimal' | 'currency'>('decimal');
  readonly minFractionDigits = input<number | undefined>(undefined);
  readonly maxFractionDigits = input<number | undefined>(undefined);
  readonly showButtons = input(false);

  readonly controlId = computed(
    () => this.inputId() ?? this.generatedId,
  );

  protected readonly value = signal<number | null>(null);
  protected readonly isDisabled = signal(false);
  protected readonly touched = signal(false);

  private readonly generatedId = createFormFieldId('form-input-number');

  private onChange: (v: number | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected showErrorState = computed(
    () => this.invalid() || (!!this.errorMessage() && this.touched()),
  );

  writeValue(value: number | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (v: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected onModelChange(next: number | null): void {
    this.value.set(next);
    this.onChange(next);
  }

  protected onBlurFn(): void {
    this.touched.set(true);
    this.onTouched();
  }
}
