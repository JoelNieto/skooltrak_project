import { Routes } from '@angular/router';

export const courseRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./courses.page').then((x) => x.CoursesPage),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./courses-list.page').then((x) => x.CoursesListPage),
      },
      {
        path: 'details',
        loadComponent: () =>
          import('./course-details.page').then((x) => x.CourseDetailsPage),
      },
    ],
  },
];
