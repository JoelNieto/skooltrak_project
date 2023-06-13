import { Routes } from '@angular/router';

export const remoteRoutes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./welcome.component').then((x) => x.NxWelcomeComponent),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
