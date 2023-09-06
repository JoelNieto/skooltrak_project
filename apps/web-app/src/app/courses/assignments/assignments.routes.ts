import { Routes } from '@angular/router';

export const assignmentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./form/assignment-form.component').then(
        (x) => x.AssignmentFormComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./details/assignment-details.component').then(
        (x) => x.AssignmentDetailsComponent
      ),
    children: [
      {
        path: 'instructions',
        loadComponent: () =>
          import('./instructions/assignment-instructions.component').then(
            (x) => x.AssignmentInstructionsComponent
          ),
      },
      {
        path: 'students-work',
        loadComponent: () =>
          import('./students-work/assignment-students-work.component').then(
            (x) => x.AssignmentStudentsWorkComponent
          ),
      },
      {
        path: 'grades',
        loadComponent: () =>
          import('./grades/assignment-grades.component').then(
            (x) => x.AssignmentGradesComponent
          ),
      },
      { path: '', redirectTo: 'instructions', pathMatch: 'full' },
    ],
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./form/assignment-form.component').then(
        (x) => x.AssignmentFormComponent
      ),
  },
];
