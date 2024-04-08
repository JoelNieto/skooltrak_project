import { Routes } from '@angular/router';

export const communicationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./communications.component').then(
        (x) => x.CommunicationsComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./inbox/inbox.component').then((x) => x.InboxComponent),
      },
    ],
  },
];
