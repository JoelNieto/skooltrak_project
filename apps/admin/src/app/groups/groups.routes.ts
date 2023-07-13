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
          import('./list/groups-list.component').then(
            (x) => x.GroupsListComponent
          ),
      },
      { path: '', redirectTo: 'all', pathMatch: 'full' },
    ],
  },
];
