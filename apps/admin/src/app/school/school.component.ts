import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent, TabsComponent, TabsItemComponent } from '@skooltrak/ui';

import { SchoolStore } from './schools.store';

@Component({
  selector: 'skooltrak-school',
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
    <skooltrak-card>
      <h2
        class="sticky pb-2 leading-tight tracking-tight flex text-gray-700 dark:text-white text-2xl font-title font-bold"
      >
        {{ 'School' | translate }}
      </h2>
      <div skooltrak-tabs>
        <skooltrak-tabs-item link="settings">
          {{ 'Settings' | translate }}
        </skooltrak-tabs-item>
        <skooltrak-tabs-item link="degrees">
          {{ 'Degrees.Title' | translate }}
        </skooltrak-tabs-item>
        <skooltrak-tabs-item link="subjects">
          {{ 'Subjects.Title' | translate }}
        </skooltrak-tabs-item>
        <skooltrak-tabs-item link="plans">
          {{ 'Plans.Title' | translate }}
        </skooltrak-tabs-item>
      </div>
      <router-outlet />
    </skooltrak-card>
  `,
  styles: [],
})
export class SchoolComponent {}
