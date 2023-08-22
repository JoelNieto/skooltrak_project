import { Routes } from '@angular/router';

export const coursesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./courses.component').then((x) => x.CoursesComponent),
    children: [
      {
        path: 'my-courses',
        loadComponent: () =>
          import('./list/courses-list.component').then(
            (x) => x.CoursesListComponent
          ),
      },
      {
        path: 'assignments',
        loadChildren: () =>
          import('./assignments/assignments.routes').then(
            (x) => x.assignmentsRoutes
          ),
      },
      {
        path: 'details',
        loadComponent: () =>
          import('./details/course-details.component').then(
            (x) => x.CourseDetailsComponent
          ),
        children: [
          {
            path: 'news',
            loadComponent: () =>
              import('./news/course-news.component').then(
                (x) => x.CourseNewsComponent
              ),
          },
          {
            path: 'schedule',
            loadComponent: () =>
              import('./schedule/course-schedule.component').then(
                (x) => x.CourseScheduleComponent
              ),
          },

          {
            path: 'files',
            loadComponent: () =>
              import('./files/course-files.component').then(
                (x) => x.CourseFilesComponent
              ),
          },
          { path: '', redirectTo: 'news', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: 'my-courses', pathMatch: 'full' },
    ],
  },
];
