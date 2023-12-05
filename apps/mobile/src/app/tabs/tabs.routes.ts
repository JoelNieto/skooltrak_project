import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tabs.page').then((x) => x.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../pages/home.page').then((m) => m.HomePage),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('../pages/messages/messages.page').then((m) => m.MessagesPage),
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('../pages/messages/chat/chat.page').then((x) => x.ChatPage),
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('../pages/schedule/schedule.page').then((m) => m.SchedulePage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
