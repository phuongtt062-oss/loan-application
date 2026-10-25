import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { guestGuard } from '@core/guards/guest.guard';
import { APP_ROUTES } from '@core/constants/app.constants';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@core/layout/shell-layout').then((m) => m.ShellLayout),
    data: { title: 'LOAN' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: APP_ROUTES.DASHBOARD },
      {
        path: APP_ROUTES.DASHBOARD,
        data: { title: 'Dashboard', breadcrumb: 'Tổng quan' },
        loadComponent: () => import('@features/dashboard/dashboard').then((m) => m.Dashboard),
      },
    ],
  },
  {
    path: APP_ROUTES.AUTH,
    canActivate: [guestGuard],
    data: { title: 'LOAN - Authentication' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: APP_ROUTES.LOGIN },
      {
        path: APP_ROUTES.LOGIN,
        data: { title: 'Login' },
        loadComponent: () => import('@features/auth/pages/login/login').then((m) => m.Login),
      },
    ],
  },
  {
    path: APP_ROUTES.NOT_FOUND,
    data: { title: '404 Not Found' },
    loadComponent: () => import('@features/error-404').then((m) => m.Error404),
  },
  {
    path: APP_ROUTES.ACCESS_DENIED,
    data: { title: '403 Access Denied' },
    loadComponent: () => import('@features/error-403').then((m) => m.Error403),
  },
  { path: '**', redirectTo: APP_ROUTES.NOT_FOUND },
];
