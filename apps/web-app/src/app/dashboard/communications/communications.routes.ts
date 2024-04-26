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
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./empty-chat/empty-chat.component').then(
                (x) => x.EmptyChatComponent,
              ),
          },
          {
            path: ':chatId',
            loadComponent: () =>
              import('./chat-item/chat-item.component').then(
                (x) => x.ChatItemComponent,
              ),
          },
          { path: '**', pathMatch: 'full', redirectTo: '' },
        ],
      },
    ],
  },
];
