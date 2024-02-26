import { Routes } from '@angular/router';

export const quizzesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./quizzes.component').then((x) => x.QuizzesComponent),
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('./quizzes-list/quizzes-list.component').then(
            (x) => x.QuizzesListComponent,
          ),
      },
      {
        path: 'assignations',
        loadComponent: () =>
          import('./quiz-assignations/quiz-assignations.component').then(
            (x) => x.QuizAssignationsComponent,
          ),
      },
      {
        path: 'preview',
        loadComponent: () =>
          import('./quiz-response-form/quiz-response-form.component').then(
            (x) => x.QuizResponseFormComponent,
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./quizzes-form/quizzes-form.component').then(
            (x) => x.QuizzesFormComponent,
          ),
      },
      {
        path: 'edit',
        loadComponent: () =>
          import('./quizzes-form/quizzes-form.component').then(
            (x) => x.QuizzesFormComponent,
          ),
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];
