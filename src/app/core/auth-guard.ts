// auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { LoginAuth } from '../auth/services/login-auth';
import { inject } from '@angular/core';
import { AdminInterface, StudentInterface } from './constant/user-login';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(LoginAuth);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  //console.log('guard', isAuthenticated);
  if (!isAuthenticated) {
   // console.log('NP');
    return router.parseUrl('/login');
  }

  // Obtener el tipo de usuario desde el servicio
  const userType: AdminInterface
      | StudentInterface = JSON.parse( localStorage.getItem(authService.tokenUser) as string);
 console.log('userType', userType);
  if (userType.tipo === 'student') {
   // console.log('entrate student', state.url);
    // Si es estudiante y no va a '/graphic', redirige a '/graphic'
    if (state.url !== '/note' && state.url !== '/change-password') {
      return router.parseUrl('/note');
    }
   
    return true;
  }

  // Si es admin, permite todo
  if (userType.tipo === 'admin') {
    return true;
  }

  // Si no se reconoce el tipo, cerrar sesión y redirigir al login
  authService.logout();
  return router.parseUrl('/login');
};
