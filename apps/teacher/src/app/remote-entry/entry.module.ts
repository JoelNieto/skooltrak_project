import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { remoteRoutes } from './entry.routes';

@NgModule({
  imports: [RouterModule.forChild(remoteRoutes)],
  providers: [],
})
export class RemoteEntryModule {}
