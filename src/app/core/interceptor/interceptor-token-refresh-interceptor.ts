import { HttpInterceptorFn } from '@angular/common/http';

export const interceptorTokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
