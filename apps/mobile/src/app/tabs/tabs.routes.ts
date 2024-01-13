import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tabs.page').then((x) => x.TabsPage),
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/courses/course.routes').then(
                (m) => m.courseRoutes,
              ),
          },
        ],
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('../pages/messages/messages.routes').then(
            (m) => m.messagesRoutes,
          ),
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
