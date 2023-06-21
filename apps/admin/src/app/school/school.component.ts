import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent, TabsComponent, TabsItemComponent } from '@skooltrak/ui';

import { SchoolStore } from './schools.store';

@Component({
  selector: 'sk-admin-school',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CardComponent,
    TranslateModule,
    TabsComponent,
    TabsItemComponent,
  ],
  providers: [provideComponentStore(SchoolStore)],
  template: `
    <sk-card>
      <h2
        class="sticky pb-2 leading-tight tracking-tight flex text-gray-700 dark:text-white text-2xl font-title font-bold"
      >
        {{ 'School' | translate }}
      </h2>
      <div skooltrak-tabs>
        <sk-tabs-item link="settings">
          {{ 'Settings' | translate }}
        </sk-tabs-item>
        <sk-tabs-item link="degrees">
          {{ 'Degrees.Title' | translate }}
        </sk-tabs-item>
        <sk-tabs-item link="subjects">
          {{ 'Subjects.Title' | translate }}
        </sk-tabs-item>
        <sk-tabs-item link="plans">
          {{ 'Plans.Title' | translate }}
        </sk-tabs-item>
      </div>
      <router-outlet />
    </sk-card>
  `,
})
export class SchoolComponent {}
