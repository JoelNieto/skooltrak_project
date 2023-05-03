import { Routes } from '@angular/router';

export const SCHOOLS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./schools.component').then((x) => x.SchoolsComponent),
    children: [
      {
        path: 'all',
        loadComponent: () =>
          import('./schools-list/schools-list.component').then(
            (x) => x.SchoolsListComponent
          ),
      },
      { path: '', redirectTo: 'all', pathMatch: 'full' },
    ],
  },
];
