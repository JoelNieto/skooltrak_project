import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'sign-in',
    title: 'Sign in',
    loadComponent: () =>
      import('./components/sign-in/sign-in.component').then(
        (x) => x.SignInComponent
      ),
  },
  {
    path: 'sign-up',
    title: 'Sign up',
    loadComponent: () =>
      import('./components/sign-up/sign-up.component').then(
        (x) => x.SignUpComponent
      ),
  },
  {
    path: 'profile',
    title: 'Profile',
    loadComponent: () =>
      import('./components/profile/profile.component').then(
        (x) => x.ProfileComponent
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
];
