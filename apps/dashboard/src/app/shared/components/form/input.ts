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
import { InputTextModule } from 'primeng/inputtext';
import { createFormFieldId } from '../../utils/form.utils';

@Component({
  selector: 'app-form-input',
  imports: [CommonModule, FormsModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInput),
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
      <input
        pInputText
        [id]="controlId()"
        [type]="type()"
        [name]="name()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        [readOnly]="readonly()"
        [attr.autocomplete]="autocomplete()"
        [ngModel]="value()"
        (ngModelChange)="onModelChange($event)"
        (blur)="onBlur()"
        [class.ng-invalid]="showErrorState()"
        [class.ng-dirty]="showErrorState()"
        class="w-full"
      />
      @if (errorMessage()) {
        <small class="text-red-500">{{ errorMessage() }}</small>
      } @else if (hint()) {
        <small class="text-muted-color">{{ hint() }}</small>
      }
    </div>
  `,
})
export class FormInput implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<string>('text');
  readonly name = input<string>('');
  readonly inputId = input<string | undefined>(undefined);
  readonly required = input(false);
  readonly invalid = input(false);
  readonly readonly = input(false);
  readonly autocomplete = input<string | undefined>(undefined);

  readonly controlId = computed(
    () => this.inputId() ?? this.generatedId,
  );

  protected readonly value = signal('');
  protected readonly isDisabled = signal(false);
  protected readonly touched = signal(false);

  private readonly generatedId = createFormFieldId('form-input');

  private onChange: (v: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected showErrorState = computed(
    () => this.invalid() || (!!this.errorMessage() && this.touched()),
  );

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected onModelChange(next: string): void {
    this.value.set(next);
    this.onChange(next);
  }

  protected onBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }
}
