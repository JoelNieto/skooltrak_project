import { Routes } from '@angular/router';

export const schoolRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./school.component').then((x) => x.SchoolComponent),
    children: [
      {
        path: 'info',
        loadComponent: () =>
          import('./school-info.component').then((x) => x.SchoolInfoComponent),
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./courses/courses.component').then(
            (x) => x.SchoolCoursesComponent
          ),
      },
      {
        path: 'plans',
        loadComponent: () =>
          import('./plans/plans.component').then((x) => x.StudyPlansComponent),
      },
      {
        path: 'subjects',
        loadComponent: () =>
          import('./subjects/subjects.component').then(
            (x) => x.SchoolSubjectsComponent
          ),
      },
      {
        path: 'degrees',
        loadComponent: () =>
          import('./degrees/degrees.component').then(
            (x) => x.SchoolDegreesComponent
          ),
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('./groups/groups.component').then(
            (x) => x.SchoolGroupsComponent
          ),
      },
      {
        path: 'periods',
        loadComponent: () =>
          import('./periods/periods.component').then(
            (x) => x.SchoolPeriodsComponent
          ),
      },
      {
        path: 'people',
        loadComponent: () =>
          import('./people/people.component').then(
            (x) => x.SchoolPeopleComponent
          ),
      },
      { path: '', redirectTo: 'info', pathMatch: 'full' },
    ],
  },
];
