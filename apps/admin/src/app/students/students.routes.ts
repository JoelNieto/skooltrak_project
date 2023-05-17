import { Routes } from '@angular/router';

export const studentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./students.component').then((x) => x.StudentsComponent),
    children: [
      {
        path: 'all',
        loadComponent: () =>
          import('./list/students-list.component').then(
            (x) => x.StudentsListComponent
          ),
      },
      { path: '', redirectTo: 'all', pathMatch: 'full' },
    ],
  },
];
