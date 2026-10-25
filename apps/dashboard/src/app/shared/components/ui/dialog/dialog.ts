import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';

const DEFAULT_DIALOG_BREAKPOINTS: Record<string, string> = {
  '960px': '75vw',
  '640px': '95vw',
};

@Component({
  selector: 'app-dialog',
  imports: [DialogModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppDialog {
  readonly visible = model(false);
  readonly dialogHide = output<void>();
  readonly header = input<string | undefined>(undefined);
  readonly modal = input(true);
  readonly closable = input(true);
  readonly dismissableMask = input(false);
  readonly closeOnEscape = input(true);
  readonly blockScroll = input(true);
  readonly styleClass = input<string | undefined>(undefined);
  readonly contentStyleClass = input<string | undefined>(undefined);
  readonly width = input<string | undefined>('min(90vw, 32rem)');
  readonly position = input<
    'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright'
  >('center');
  readonly draggable = input(false);
  readonly resizable = input(false);
  readonly breakpoints = input<Record<string, string> | undefined>(undefined);

  readonly effectiveBreakpoints = computed(
    () => this.breakpoints() ?? DEFAULT_DIALOG_BREAKPOINTS,
  );

  readonly mergedStyleClass = computed(() => {
    const extra = this.styleClass()?.trim();
    return extra ? `app-dialog ${extra}` : 'app-dialog';
  });

  protected emitDialogHide(): void {
    this.dialogHide.emit();
  }
}
