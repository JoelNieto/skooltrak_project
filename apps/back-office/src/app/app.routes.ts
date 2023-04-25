import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
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
        loadComponent: () =>
          import('./schools/schools.component').then((x) => x.SchoolsComponent),
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
