import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then((x) => x.DashboardComponent),
    children: [
      {
        path: 'home',
        title: 'HOME',
        loadChildren: () =>
          import('./home/home.routes').then((x) => x.homeRoutes),
      },
      {
        path: 'courses',
        title: 'COURSES.TITLE',
        loadChildren: () =>
          import('./courses/courses.routes').then((x) => x.coursesRoutes),
      },
      {
        path: 'groups',
        title: 'GROUPS.TITLE',
        loadChildren: () =>
          import('./groups/groups.routes').then((x) => x.groupsRoutes),
      },
      {
        path: 'grades',
        title: 'Grades',
        loadComponent: () =>
          import('./grades/grades.component').then((x) => x.GradesComponent),
      },
      {
        path: 'profile',
        title: 'Profile',
        loadComponent: () =>
          import('../components/profile/profile.component').then(
            (x) => x.ProfileComponent,
          ),
      },
      {
        path: 'settings',
        title: 'Settings',
        loadChildren: () =>
          import('./settings/settings.routes').then((x) => x.settingRoutes),
      },
      {
        path: 'school',
        title: 'SCHOOL.SETTINGS',
        loadChildren: () =>
          import('./school/school.routes').then((x) => x.schoolRoutes),
      },
      { path: '', pathMatch: 'full', redirectTo: 'home' },
    ],
  },
];
