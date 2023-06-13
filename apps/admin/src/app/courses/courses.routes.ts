import { Routes } from '@angular/router';

export const coursesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./courses.component').then((x) => x.CoursesComponent),
    children: [
      {
        path: 'all',
        loadComponent: () =>
          import('./list/courses-list.component').then(
            (x) => x.CoursesListComponent
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
            path: 'schedule',
            loadComponent: () =>
              import('./schedule/courses-schedule.component').then(
                (x) => x.CoursesSchedule
              ),
          },
          { path: '', redirectTo: 'schedule', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: 'all', pathMatch: 'full' },
    ],
  },
];
