import { NxWelcomeComponent } from './nx-welcome.component';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'teacher',
    loadChildren: () =>
      import('teacher/Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: 'student',
    loadChildren: () =>
      import('student/Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('admin/Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: '',
    component: NxWelcomeComponent,
  },
];
