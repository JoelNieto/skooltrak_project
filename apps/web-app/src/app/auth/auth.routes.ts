import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./pages/sign-in/sign-in.component').then(
        (x) => x.SignInComponent,
      ),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./pages/sign-up/sign-up.component').then(
        (x) => x.SignUpComponent,
      ),
  },
  {
    path: 'password-reset',
    loadComponent: () =>
      import('./pages/password-reset/password-reset.component').then(
        (x) => x.PasswordResetComponent,
      ),
  },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
];
