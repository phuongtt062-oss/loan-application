import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import type { BreadcrumbItemClickEvent } from 'primeng/types/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  imports: [BreadcrumbModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBreadcrumb {
  readonly model = input<MenuItem[]>([]);
  readonly home = input<MenuItem | undefined>(undefined);
  readonly homeAriaLabel = input<string | undefined>(undefined);
  readonly styleClass = input<string | undefined>(undefined);
  readonly itemClick = output<BreadcrumbItemClickEvent>();

  onItemClick(event: BreadcrumbItemClickEvent) {
    this.itemClick.emit(event);
  }
}
