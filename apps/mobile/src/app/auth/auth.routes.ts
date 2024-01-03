import { Routes } from '@angular/router';

import { SignInPage } from './sign-in.page';
import { SignUpPage } from './sign-up.page';

export const authRoutes: Routes = [
  { path: 'sign-in', component: SignInPage },
  { path: 'sign-up', component: SignUpPage },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
];
