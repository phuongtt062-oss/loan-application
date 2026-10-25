import type { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@features/auth/services/auth.service';
import { SKIP_AUTH } from '@core/tokens/http-context.tokens';
import { APP_ROUTES } from '@core/constants/app.constants';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (req.context.get(SKIP_AUTH)) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        auth.clearSession();
        router.navigate([APP_ROUTES.AUTH, APP_ROUTES.LOGIN]);
      }
      return throwError(() => error);
    }),
  );
};
