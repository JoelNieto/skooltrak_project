import { Routes } from '@angular/router';

export const plansRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./plans.component').then((x) => x.PlansComponent),
  },
];
