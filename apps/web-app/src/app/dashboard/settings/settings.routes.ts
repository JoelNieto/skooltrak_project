import { Routes } from '@angular/router';

export const settingRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./settings.component').then((x) => x.SettingsComponent),
    children: [
      {
        path: 'schools',
        loadComponent: () =>
          import('./schools/schools.component').then((x) => x.SchoolsComponent),
      },
      { path: '', redirectTo: 'schools', pathMatch: 'full' },
    ],
  },
];
