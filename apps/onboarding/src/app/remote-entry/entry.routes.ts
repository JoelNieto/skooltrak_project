import { Routes } from '@angular/router';

export const remoteRoutes: Routes = [
  {
    path: 'sign-in',
    loadComponent: () =>
      import('../sign-in/sign-in.component').then((x) => x.SignInComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('../sign-up/sign-up.component').then((x) => x.SignUpComponent),
    children: [
      {
        path: 'personal-data',
        loadComponent: () =>
          import('../personal-data/personal-data.component').then(
            (x) => x.PersonalDataComponent
          ),
      },
      {
        path: '',
        loadComponent: () =>
          import('../role-selector/role-selector.component').then(
            (x) => x.RoleSelectorComponent
          ),
      },
    ],
  },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
];