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
          import('./list/schools-list.component').then(
            (x) => x.SchoolsListComponent
          ),
      },
      {
        path: 'details',
        loadComponent: () =>
          import('./details/schools-details.component').then(
            (x) => x.SchoolsDetailsComponent
          ),
        children: [
          {
            path: 'admins',
            loadComponent: () =>
              import('./admins/schools-admins.component').then(
                (x) => x.SchoolsAdminsComponent
              ),
          },
          { path: '', redirectTo: 'admins', pathMatch: 'full' },
        ],
      },
      {
        path: 'edit',
        loadComponent: () =>
          import('./form/schools-form.component').then(
            (x) => x.SchoolsFormComponent
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./form/schools-form.component').then(
            (x) => x.SchoolsFormComponent
          ),
      },
      { path: '', redirectTo: 'all', pathMatch: 'full' },
    ],
  },
];
