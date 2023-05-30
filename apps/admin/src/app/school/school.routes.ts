import { Routes } from '@angular/router';

export const schoolRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./school.component').then((x) => x.SchoolComponent),
    children: [
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/school-settings.component').then(
            (x) => x.SchoolSettingsComponent
          ),
      },
      {
        path: 'subjects',
        loadComponent: () =>
          import('./subjects/school-subjects.component').then(
            (x) => x.SchoolSubjectsComponent
          ),
      },
      { path: '', redirectTo: 'settings', pathMatch: 'full' },
    ],
  },
];
