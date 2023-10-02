import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('../app.component').then((x) => x.AppComponent),
    children: [
      {
        path: 'home',
        title: 'Home',
        loadChildren: () =>
          import('../home/home.routes').then((x) => x.homeRoutes),
      },
      {
        path: 'courses',
        title: 'Courses',
        loadChildren: () =>
          import('../courses/courses.routes').then((x) => x.coursesRoutes),
      },
      {
        path: 'grades',
        title: 'Grades',
        loadComponent: () =>
          import('../grades/grades.component').then((x) => x.GradesComponent),
      },
      {
        path: 'profile',
        title: 'Profile',
        loadComponent: () =>
          import('../components/profile/profile.component').then(
            (x) => x.ProfileComponent
          ),
      },
      {
        path: 'settings',
        title: 'Settings',
        loadChildren: () =>
          import('../settings/settings.routes').then((x) => x.settingRoutes),
      },
      {
        path: 'school',
        title: 'School Settings',
        loadChildren: () =>
          import('../school/school.routes').then((x) => x.schoolRoutes),
      },
      { path: '', pathMatch: 'full', redirectTo: 'home' },
    ],
  },
];
