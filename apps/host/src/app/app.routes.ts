import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('onboarding/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'app',
    loadChildren: () => import('web-app/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('@skooltrak/ui').then((x) => x.DashboardComponent),
    children: [
      {
        path: '',
        loadChildren: () => import('admin/Routes').then((m) => m.remoteRoutes),
      },
    ],
  },
];
