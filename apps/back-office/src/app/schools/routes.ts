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
      {
        path: 'details',
        loadComponent: () =>
          import('./schools-details/schools-details.component').then(
            (x) => x.SchoolsDetailsComponent
          ),
      },
      {
        path: 'edit',
        loadComponent: () =>
          import('./schools-form/schools-form.component').then(
            (x) => x.SchoolsFormComponent
          ),
      },
      { path: '', redirectTo: 'all', pathMatch: 'full' },
    ],
  },
];
