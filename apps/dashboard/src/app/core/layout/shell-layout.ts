import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  type ActivatedRouteSnapshot,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '@core/services/layout.service';
import { AppBreadcrumb } from '@shared/components/ui/breadcrumb/breadcrumb';
import { AppProgress } from '@shared/components/ui/progress/progress';
import { AppToast } from '@shared/components/ui/toast/toast';
import { Header } from './header/header';
import { Sidebar } from './sidebar';
import { LoadingService } from '@core/services/loading.service';
import { AppLoading } from '@shared/components/ui/loading/loading';

@Component({
  selector: 'app-shell-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    Header,
    Sidebar,
    // AppProgress,
    // AppToast,
    // AppBreadcrumb,
    // AppLoading,
  ],
  template: `
    <div class="layout-wrapper" [ngClass]="containerClass()">
      <app-header />
      <app-sidebar />
      <div class="layout-main-container">
        <div class="layout-main layout-main--outlet-host">
          @if (routeLoading()) {
            <div
              class="router-loading-bar pointer-events-none absolute inset-x-0 top-0 z-30 overflow-hidden"
              aria-hidden="true"
            >
              <!-- <app-progress [mode]="'indeterminate'" [height]="'3px'" /> -->
            </div>
          }
          <div class="layout-outlet-wrap shell-page">
            <div class="card shell-main-card">
              <!-- <app-breadcrumb [model]="breadcrumbItems()" [home]="breadcrumbHome" /> -->
              <div class="shell-outlet">
                <router-outlet />
              </div>
            </div>
          </div>
          <!-- <app-toast position="top-right" />
          <app-loading [visible]="loading.visible()" /> -->
        </div>
        <div class="layout-mask"></div>
      </div>
    </div>
  `,
  styleUrl: './shell-layout.scss',
})
export class ShellLayout {
  private readonly layoutService = inject(LayoutService);
  private readonly router = inject(Router);
  protected readonly loading = inject(LoadingService);

  protected readonly routeLoading = signal(false);

  protected readonly breadcrumbHome: MenuItem = { icon: 'pi pi-home', routerLink: '/home' };
  protected readonly breadcrumbItems = signal<MenuItem[]>([
    { label: 'Dashboard', routerLink: '/home' },
    { label: '', disabled: true },
  ]);

  constructor() {
    this.router.events
      .pipe(
        filter(
          (e): e is NavigationStart | NavigationEnd | NavigationCancel | NavigationError =>
            e instanceof NavigationStart ||
            e instanceof NavigationEnd ||
            e instanceof NavigationCancel ||
            e instanceof NavigationError,
        ),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        if (e instanceof NavigationStart) {
          this.routeLoading.set(true);
        } else {
          this.routeLoading.set(false);
          this.syncBreadcrumb();
        }
      });

    this.syncBreadcrumb();

    effect(() => {
      const state = this.layoutService.layoutState();
      if (state.mobileMenuActive) {
        document.body.classList.add('blocked-scroll');
      } else {
        document.body.classList.remove('blocked-scroll');
      }
    });
  }

  /** Deepest snapshot in the current URL tree (ActivatedRoute.snapshot can be undefined very early in shell init). */
  private getLeafRouteSnapshot(): ActivatedRouteSnapshot {
    let node = this.router.routerState.snapshot.root;
    while (node.firstChild) {
      node = node.firstChild;
    }
    return node;
  }

  private syncBreadcrumb(): void {
    const leaf = this.getLeafRouteSnapshot();
    const data = (leaf.data ?? {}) as Record<string, unknown>;
    const label = String(data['breadcrumb'] ?? data['title'] ?? '');
    this.breadcrumbItems.set([
      { label: 'Dashboard', routerLink: '/home' },
      { label: label || '—', disabled: true },
    ]);
  }

  protected readonly containerClass = computed(() => {
    const config = this.layoutService.layoutConfig();
    const state = this.layoutService.layoutState();
    return {
      'layout-overlay': config.menuMode === 'overlay',
      'layout-static': config.menuMode === 'static',
      'layout-static-inactive': state.staticMenuDesktopInactive && config.menuMode === 'static',
      'layout-overlay-active': state.overlayMenuActive,
      'layout-mobile-active': state.mobileMenuActive,
    };
  });
}
