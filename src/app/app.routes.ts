import { Routes } from '@angular/router';
import { Contain } from './core/contain/contain';

export const routes: Routes = [
  {
    path: '',
    component: Contain,
    children: [
      {
        path: 'subject',
        loadComponent: () =>
          import('./features/components/subject-itace/subject-itace').then((c) => c.SubjectItace),
      },
      {
        path: 'semester',
        loadComponent: () =>
          import('./features/components/semester/semester').then((c) => c.Semester),
      },
      {
        path: 'student',
        loadComponent: () => import('./features/components/student/student').then((c) => c.Student),
      },
      {
        path: 'note',
        loadComponent: () => import('./features/components/note/note').then((c) => c.Note),
      },
      {
        path: 'graphic',
        loadComponent: () => import('./features/components/graphic/graphic').then((c) => c.Graphic),
      },

      { path: '', redirectTo: '/subject', pathMatch: 'full' }, // Ruta por defecto
    ],
  },
];
