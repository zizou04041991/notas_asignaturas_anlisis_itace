import { Routes } from '@angular/router';
import { Contain } from './core/contain/contain';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Contain,

    children: [
      {
        path: 'subject',
        loadComponent: () =>
          import('./features/components/subject-itace/subject-itace').then((c) => c.SubjectItace),
        canActivate: [authGuard], // protegida,
      },
      {
        path: 'tcp',
        loadComponent: () => import('./features/components/tcp/tcp').then((c) => c.TCP),
        canActivate: [authGuard], // protegida,
      },
      {
        path: 'semester',
        loadComponent: () =>
          import('./features/components/semester/semester').then((c) => c.Semester),
        canActivate: [authGuard], // protegida,
      },
      {
        path: 'student',
        loadComponent: () => import('./features/components/student/student').then((c) => c.Student),
        canActivate: [authGuard], // protegida,
      },
      {
        path: 'note',
        loadComponent: () => import('./features/components/note/note').then((c) => c.Note),
        canActivate: [authGuard], // protegida,
      },
      {
        path: 'graphic',
        loadComponent: () => import('./features/components/graphic/graphic').then((c) => c.Graphic),
        canActivate: [authGuard], // protegida,
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./features/components/change-pasword/change-pasword').then(
            (c) => c.ChangePasword,
          ),
        canActivate: [authGuard], // protegida,
      },
      {
        path: 'user-admin',
        loadComponent: () =>
          import('./features/components/user-admin/user-admin').then((c) => c.UserAdmin),
        canActivate: [authGuard], // protegida,
      },

      { path: '', redirectTo: '/graphic', pathMatch: 'full' }, // Ruta por defecto
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((c) => c.Login),
  },
  {
    path: 'admin',
    loadComponent: () => import('./auth/login/login').then((c) => c.Login),
  },
];
