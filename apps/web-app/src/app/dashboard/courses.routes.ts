import { Routes } from '@angular/router';

export const coursesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./courses/courses.component').then((x) => x.CoursesComponent),
    children: [
      {
        path: 'my-courses',
        loadComponent: () =>
          import('./courses/list/courses-list.component').then(
            (x) => x.CoursesListComponent,
          ),
      },
      {
        path: 'assignments',
        loadChildren: () =>
          import('./courses/assignments/assignments.routes').then(
            (x) => x.assignmentsRoutes,
          ),
      },
      {
        path: 'details',
        loadComponent: () =>
          import('./courses/details/course-details.component').then(
            (x) => x.CourseDetailsComponent,
          ),
        children: [
          {
            path: 'news',
            loadComponent: () =>
              import('./courses/news/course-news.component').then(
                (x) => x.CourseNewsComponent,
              ),
          },
          {
            path: 'grades',
            loadComponent: () =>
              import('./grades/course-grades.component').then(
                (x) => x.CourseGradesComponent,
              ),
          },
          {
            path: 'schedule',
            loadComponent: () =>
              import('./courses/schedule/course-schedule.component').then(
                (x) => x.CourseScheduleComponent,
              ),
          },
          {
            path: 'students',
            loadComponent: () =>
              import('./students/students.component').then(
                (x) => x.CoursesComponent,
              ),
          },
          {
            path: 'files',
            loadComponent: () =>
              import('./courses/files/course-files.component').then(
                (x) => x.CourseFilesComponent,
              ),
          },
          { path: '', redirectTo: 'news', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: 'my-courses', pathMatch: 'full' },
    ],
  },
];
