import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./pages/sign-in/sign-in.component').then(
        (x) => x.SignInComponent
      ),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./pages/sign-up/sign-up.component').then(
        (x) => x.SignUpComponent
      ),
  },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
];