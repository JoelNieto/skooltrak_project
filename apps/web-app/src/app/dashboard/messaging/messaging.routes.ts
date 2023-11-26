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
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./welcome/welcome.component').then(
                (x) => x.WelcomeComponent,
              ),
          },
          {
            path: 'chat',
            loadComponent: () =>
              import('./chat/chat.component').then((x) => x.ChatComponent),
          },
        ],
      },
      { path: '', redirectTo: 'inbox', pathMatch: 'full' },
      { path: '**', redirectTo: 'inbox', pathMatch: 'full' },
    ],
  },
];
