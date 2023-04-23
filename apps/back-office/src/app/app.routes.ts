import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@skooltrak/auth').then((x) => x.SignInComponent),
  },
];
