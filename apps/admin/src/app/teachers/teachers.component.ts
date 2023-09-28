import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '@skooltrak/ui';

import { TeacherStore } from './teachers.store';

@Component({
  selector: 'sk-admin-teachers',
  standalone: true,
  imports: [
    CardComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TranslateModule,
  ],
  providers: [provideComponentStore(TeacherStore)],
  template: `<sk-card
    ><h2
      header
      class=" font-title sticky top-0 flex pb-2 text-2xl font-bold leading-tight tracking-tight text-gray-700 dark:text-white"
    >
      {{ 'Teachers' | translate }}
    </h2>
    <router-outlet />
  </sk-card>`,
})
export class TeachersComponent {}
