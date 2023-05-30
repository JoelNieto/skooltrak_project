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
      {
        path: 'admission',
        loadComponent: () =>
          import('./admission/admission.component').then(
            (x) => x.AdmissionComponent
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./form/student-form.component').then(
            (x) => x.StudentFormComponent
          ),
      },
      { path: '', redirectTo: 'all', pathMatch: 'full' },
    ],
  },
];
