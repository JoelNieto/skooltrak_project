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
];
