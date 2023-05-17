import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
  {
    path: 'home',
    loadComponent: () =>
      import('./nx-welcome.component').then((x) => x.NxWelcomeComponent),
  },
  {
    path: 'students',
    loadChildren: () =>
      import('../students/students.routes').then((x) => x.studentsRoutes),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
