import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./remote-entry/entry.module').then((m) => m.RemoteEntryModule),
  },
];
