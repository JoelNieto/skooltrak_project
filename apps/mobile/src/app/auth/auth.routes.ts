import { Routes } from '@angular/router';

import { ResetPasswordPage } from './reset-password.page';
import { SignInPage } from './sign-in.page';
import { SignUpPage } from './sign-up.page';

export const authRoutes: Routes = [
  { path: 'sign-in', component: SignInPage },
  { path: 'sign-up', component: SignUpPage },
  { path: 'reset-password', component: ResetPasswordPage },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
];
