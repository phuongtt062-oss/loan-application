import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-progress',
  imports: [ProgressBarModule],
  templateUrl: './progress.html',
  styleUrl: './progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppProgress {
  /** 0–100: `mode` = determinate */
  readonly value = input(0);
  readonly mode = input<'determinate' | 'indeterminate'>('determinate');
  readonly showValue = input(false);
  readonly styleClass = input<string | undefined>(undefined);
  readonly height = input('0.5rem');
}
