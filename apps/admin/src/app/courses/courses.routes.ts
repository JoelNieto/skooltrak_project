import { Routes } from '@angular/router';

import { CourseDetailsComponent } from './details/course-details.component';

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
        component: CourseDetailsComponent,

        children: [
          {
            path: 'schedule',
            loadComponent: () =>
              import('./schedule/courses-schedule.component').then(
                (x) => x.CoursesScheduleComponent
              ),
          },
          { path: '', redirectTo: 'schedule', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: 'all', pathMatch: 'full' },
    ],
  },
];
