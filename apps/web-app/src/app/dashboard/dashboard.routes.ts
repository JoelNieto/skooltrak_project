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
        path: 'schedule',
        title: 'SCHEDULE',
        loadComponent: () =>
          import('./home/schedule/home-schedule.component').then(
            (x) => x.HomeScheduleComponent,
          ),
      },
      {
        path: 'assignments',
        loadChildren: () =>
          import('./assignments/assignments.routes').then(
            (x) => x.assignmentsRoutes,
          ),
      },
      {
        path: 'courses',
        title: 'COURSES.TITLE',
        loadChildren: () =>
          import('./courses/courses.routes').then((x) => x.coursesRoutes),
      },
      {
        path: 'quizzes',
        title: 'QUIZZES.TITLE',
        loadChildren: () =>
          import('./quizzes/quizzes.routes').then((x) => x.quizzesRoutes),
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
        path: 'change-password',
        title: 'CHANGE_PASSWORD.TITLE',
        loadComponent: () =>
          import(
            '../auth/pages/change-password/change-password.component'
          ).then((x) => x.ChangePasswordComponent),
      },
      {
        path: 'messaging',
        title: 'MESSAGING.TITLE',
        loadChildren: () =>
          import('./messaging/messaging.routes').then((x) => x.messagingRoutes),
      },
      {
        path: 'communications',
        title: 'MESSAGING.TITLE',
        loadChildren: () =>
          import('./communications/communications.routes').then(
            (x) => x.communicationsRoutes,
          ),
      },
      {
        path: 'student-profile',
        title: 'STUDENTS.PROFILE',
        loadComponent: () =>
          import(
            '../components/student-profile/student-profile.component'
          ).then((x) => x.StudentProfileComponent),
      },
      {
        path: 'school',
        title: 'SCHOOL.SETTINGS',
        // canActivateChild: [(): boolean => inject(webStore.AuthStore).isAdmin()],
        loadChildren: () =>
          import('./school/school.routes').then((x) => x.schoolRoutes),
      },
      { path: '', pathMatch: 'full', redirectTo: 'home' },
    ],
  },
];
