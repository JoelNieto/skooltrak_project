import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home.component').then((x) => x.HomeComponent),
    children: [
      {
        path: 'schedule',
        loadComponent: () =>
          import('./schedule/schedule.component').then(
            (x) => x.ScheduleComponent
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'schedule' },
    ],
  },
];
[];
