import { Route } from '@angular/router';

import { authGuard } from './auth/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'app',
    canActivateChild: [authGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes').then((x) => x.authRoutes),
  },
];
