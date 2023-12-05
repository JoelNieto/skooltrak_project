import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./pages/messages/chat/chat.page').then((x) => x.ChatPage),
  },
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
];
