import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs.page').then((x) => x.TabsPage),
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../pages/tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('../pages/messages/messages.routes').then(
            (m) => m.messagesRoutes,
          ),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../pages/tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: '',
        redirectTo: 'tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
];
