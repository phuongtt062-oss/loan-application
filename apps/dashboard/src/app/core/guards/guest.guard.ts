import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { APP_ROUTES } from '@core/constants/app.constants';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree([APP_ROUTES.AUTH, APP_ROUTES.LOGIN]);
};
