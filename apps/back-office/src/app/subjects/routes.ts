import { Routes } from '@angular/router';

export const SUBJECTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./subjects.component').then((x) => x.SubjectsComponents),
    children: [
      {
        path: 'all',
        loadComponent: () =>
          import('./list/subjects-list.component').then(
            (x) => x.SubjectsListComponent
          ),
      },
      {
        path: 'edit',
        loadComponent: () =>
          import('./form/subjects-form.component').then(
            (x) => x.SubjectsFormComponent
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./form/subjects-form.component').then(
            (x) => x.SubjectsFormComponent
          ),
      },
      { path: '', redirectTo: 'all', pathMatch: 'full' },
    ],
  },
];
