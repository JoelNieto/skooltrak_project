import { Routes } from '@angular/router';

export const messagingRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./messaging.component').then((x) => x.MessagingComponent),
    children: [
      {
        path: 'inbox',
        loadComponent: () =>
          import('./inbox/inbox.component').then((x) => x.InboxComponent),
      },
      { path: '', redirectTo: 'inbox', pathMatch: 'full' },
      { path: '**', redirectTo: 'inbox', pathMatch: 'full' },
    ],
  },
];
