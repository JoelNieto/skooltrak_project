import { Routes } from '@angular/router';

export const groupsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./groups.component').then((x) => x.GroupsComponent),
    children: [
      {
        path: 'all',
        loadComponent: () =>
          import('./list/list.component').then((x) => x.GroupsListComponent),
      },
      {
        path: 'details',
        loadComponent: () =>
          import('./details/details.component').then(
            (x) => x.GroupsDetailsComponent
          ),
      },
      { path: '', redirectTo: 'all', pathMatch: 'full' },
    ],
  },
];
