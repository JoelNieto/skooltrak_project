import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('@skooltrak/auth').then((x) => x.authRoutes),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('@skooltrak/ui').then((x) => x.DashboardComponent),
    children: [
      {
        path: 'teacher',
        loadChildren: () =>
          import('teacher/Module').then((m) => m.RemoteEntryModule),
      },
      {
        path: 'student',
        loadChildren: () =>
          import('student/Module').then((m) => m.RemoteEntryModule),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('admin/Module').then((m) => m.RemoteEntryModule),
      },
    ],
  },
];
