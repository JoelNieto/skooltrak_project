import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { webStore } from '@skooltrak/store';

export const coursesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin/courses/courses.component').then(
        (x) => x.CoursesComponent,
      ),
    children: [
      {
        canMatch: [(): boolean => inject(webStore.AuthStore).isAdmin()],
        path: 'my-courses',
        loadComponent: () =>
          import('./admin/list/courses-list.component').then(
            (x) => x.CoursesListComponent,
          ),
      },
      {
        path: 'assignments',
        loadChildren: () =>
          import('./admin/courses/assignments/assignments.routes').then(
            (x) => x.assignmentsRoutes,
          ),
      },
      {
        path: 'details',
        loadComponent: () =>
          import('./admin/courses/details/course-details.component').then(
            (x) => x.CourseDetailsComponent,
          ),
        children: [
          {
            path: 'news',
            loadComponent: () =>
              import('./admin/courses/news/course-news.component').then(
                (x) => x.CourseNewsComponent,
              ),
          },
          {
            path: 'grades',
            loadComponent: () =>
              import('./admin/grades/course-grades.component').then(
                (x) => x.CourseGradesComponent,
              ),
          },
          {
            path: 'schedule',
            loadComponent: () =>
              import('./admin/courses/schedule/course-schedule.component').then(
                (x) => x.CourseScheduleComponent,
              ),
          },
          {
            path: 'students',
            loadComponent: () =>
              import('./admin/students/students.component').then(
                (x) => x.CoursesComponent,
              ),
          },
          {
            path: 'files',
            loadComponent: () =>
              import('./admin/courses/files/course-files.component').then(
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
