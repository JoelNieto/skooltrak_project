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
      {
        path: 'new',
        loadComponent: () =>
          import('./form/teachers-form.component').then(
            (x) => x.TeachersFormComponent
          ),
        title: 'New Teacher',
      },
      { path: '', redirectTo: 'all', pathMatch: 'full' },
    ],
  },
];
