import { Routes } from '@angular/router';

export const plansRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./plans.component').then((x) => x.PlansComponent),
    children: [
      {
        path: 'courses',
        loadComponent: () =>
          import('./courses/plan-courses.component').then(
            (x) => x.PlanCoursesComponent
          ),
      },
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
    ],
  },
];
