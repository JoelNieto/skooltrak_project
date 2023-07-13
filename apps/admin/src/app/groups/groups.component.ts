import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent, UtilService } from '@skooltrak/ui';

import { GroupsStore } from './groups.store';

@Component({
  selector: 'sk-admin-groups',
  standalone: true,
  imports: [RouterOutlet, CardComponent, TranslateModule],
  providers: [provideComponentStore(GroupsStore), UtilService],
  template: `<sk-card
    ><h2
      header
      class=" font-title sticky top-0 flex pb-2 text-2xl font-bold leading-tight tracking-tight text-gray-700 dark:text-white"
    >
      {{ 'Groups' | translate }}
    </h2>
    <router-outlet />
  </sk-card>`,
})
export class GroupsComponent {
  store = inject(GroupsStore);
}
