import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
  {
    path: 'home',
    loadComponent: () =>
      import('./nx-welcome.component').then((x) => x.NxWelcomeComponent),
  },
  {
    path: 'students',
    loadComponent: () =>
      import('../students/students.component').then((x) => x.StudentsComponent),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
