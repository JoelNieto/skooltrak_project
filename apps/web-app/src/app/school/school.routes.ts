import { Routes } from '@angular/router';

export const schoolRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./school.component').then((x) => x.SchoolComponent),
    children: [
      {
        path: 'info',
        loadComponent: () =>
          import('./school-info.component').then((x) => x.SchoolInfoComponent),
      },
      { path: '', redirectTo: 'info', pathMatch: 'full' },
    ],
  },
];
