import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ToastPositionType } from 'primeng/types/toast';

@Component({
  selector: 'app-toast',
  imports: [ToastModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppToast {
  readonly key = input<string | undefined>(undefined);
  readonly position = input<ToastPositionType>('top-right');
  readonly styleClass = input<string | undefined>(undefined);
}
