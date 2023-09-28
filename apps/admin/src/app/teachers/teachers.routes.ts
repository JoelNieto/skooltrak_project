import { Routes } from '@angular/router';

export const teacherRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./teachers.component').then((x) => x.TeachersComponent),
    children: [
      {
        path: 'all',
        loadComponent: () =>
          import('./list/teachers-list.component').then(
            (x) => x.TeachersListComponent
          ),
      },
      { path: '', redirectTo: 'all', pathMatch: 'full' },
    ],
  },
];
