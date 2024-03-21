import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home.component').then((x) => x.HomeComponent),
    children: [
      {
        path: 'publications',
        loadComponent: () =>
          import('../publications/publications.component').then(
            (x) => x.PublicationsComponent,
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'publications' },
    ],
  },
];
