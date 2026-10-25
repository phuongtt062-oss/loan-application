import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading',
  imports: [ProgressSpinnerModule],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLoading {
  readonly visible = input(false);
  readonly spinnerSize = input('3rem');
  readonly strokeWidth = input('4');
  readonly zIndex = input(1200);
}
