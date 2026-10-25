import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [ConfirmDialogModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppConfirmDialog {
  readonly acceptLabel = input('Đồng ý');
  readonly rejectLabel = input('Hủy');
  readonly acceptIcon = input<string | undefined>(undefined);
  readonly rejectIcon = input<string | undefined>(undefined);
  readonly closeOnEscape = input(true);
  readonly dismissableMask = input(true);
  readonly styleClass = input<string | undefined>(undefined);
}
