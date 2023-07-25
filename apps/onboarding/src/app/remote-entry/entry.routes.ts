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
  },
  {
    path: 'sign-up-confirmation',
    loadComponent: () =>
      import('../signup-confirmation/signup-confirmation.component').then(
        (x) => x.SignUpConfirmationComponent
      ),
  },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
];
