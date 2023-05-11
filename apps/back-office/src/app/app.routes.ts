import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  {
    path: 'app',
    canActivateChild: [],
    loadComponent: () =>
      import('./admin/admin.component').then((x) => x.AdminComponent),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.component').then((x) => x.HomeComponent),
      },
      {
        path: 'schools',
        title: 'Schools',
        loadChildren: () =>
          import('./schools/routes').then((x) => x.SCHOOLS_ROUTES),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'sign-in',
    loadComponent: () =>
      import('@skooltrak/auth').then((x) => x.SignInComponent),
  },
];
