import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('onboarding/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('@skooltrak/ui').then((x) => x.DashboardComponent),
    children: [
      {
        path: 'admin',
        loadChildren: () => import('admin/Routes').then((m) => m.remoteRoutes),
      },
      {
        path: 'web-app',
        loadChildren: () =>
          import('web-app/Routes').then((m) => m.remoteRoutes),
      },
    ],
  },
];
