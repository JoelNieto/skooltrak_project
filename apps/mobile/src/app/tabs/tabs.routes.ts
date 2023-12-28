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
        loadChildren: () =>
          import('../pages/messages/messages.routes').then(
            (m) => m.messagesRoutes,
          ),
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('../pages/messages/chat.page').then((x) => x.ChatPage),
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('../pages/schedule/schedule.page').then((m) => m.SchedulePage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../pages/profile/profile.page').then((x) => x.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
