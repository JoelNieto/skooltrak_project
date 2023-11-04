import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'app',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./auth/auth.routes').then((x) => x.authRoutes),
  },
];
