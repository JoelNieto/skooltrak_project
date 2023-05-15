import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./nx-welcome.component').then((x) => x.NxWelcomeComponent),
  },
];
