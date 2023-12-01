import { Routes } from '@angular/router';

export const messagesRoutes: Routes = [
  {
    path: 'inbox',
    loadComponent: () => import('./messages.page').then((x) => x.MessagesPage),
  },
  {
    path: 'chat',
    loadComponent: () => import('./chat/chat.page').then((x) => x.ChatPage),
  },
  { path: '', redirectTo: 'inbox', pathMatch: 'full' },
  { path: '**', redirectTo: 'inbox', pathMatch: 'full' },
];
