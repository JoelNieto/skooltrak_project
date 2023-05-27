import { Routes } from '@angular/router';

export const schoolRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./school.component').then((x) => x.SchoolComponent),
  },
];
