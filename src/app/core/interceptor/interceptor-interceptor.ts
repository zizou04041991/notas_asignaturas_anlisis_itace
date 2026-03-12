import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

export const interceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        toastService.showErrorToast('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
      if (error.status === 401) {
        toastService.showErrorToast('Las credenciales son incorrectas.');
      }
      return throwError(() => error);
    }),
  );
};
