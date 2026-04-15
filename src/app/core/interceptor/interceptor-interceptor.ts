import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { LoginAuth } from '../../auth/services/login-auth';
import { Router } from '@angular/router';

export const interceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authService = inject(LoginAuth);
  const router = inject(Router);
  const access = localStorage.getItem(authService.tokenAccess) as string;
  let authReq = req;
  if (!!access) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${access}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        toastService.showErrorToast('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
      if (error.status === 401) {
        if (error.error.code === 'token_not_valid') {
          //toastService.showErrorToast('El token caduco.');
          return authService.refreshToken().pipe(
            switchMap((res: any) => {
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.access}`,
                },
              });
              localStorage.setItem(authService.tokenAccess, res.access);
              localStorage.setItem(authService.tokenRefresh, res.refresh);
              return next(retryReq);
            }),

            catchError((refreshErr) => {
              const finalError = new Error(refreshErr);

              localStorage.removeItem(authService.tokenAccess);
              localStorage.removeItem(authService.tokenRefresh);
              router.navigateByUrl('login');
              return throwError(() => finalError);
            }),
          );
        }
      }
      if (error.status === 400) {
        console.log('dime del Error', error.error);
        if ('error' in error.error && typeof error.error['error'] === 'string') {
          toastService.showErrorToast(error.error['error']);
        }
      }
      return throwError(() => error);
    }),
  );
};
