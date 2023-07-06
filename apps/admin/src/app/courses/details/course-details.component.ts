import { IconsModule } from '@amithvns/ng-heroicons';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent, TabsComponent, TabsItemComponent } from '@skooltrak/ui';

import { CoursesStore } from '../courses.store';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    RouterLink,
    TabsComponent,
    TabsItemComponent,
    TranslateModule,
    RouterOutlet,
    IconsModule,
  ],
  template: `<sk-card>
    <div header>
      <a
        routerLink="../all"
        class="leading-tight tracking-tight flex text-gray-300 mb-2 dark:text-white text-sm font-title"
      >
        < Back
      </a>
      <h2
        class="leading-tight tracking-tight flex mb-1 text-gray-700 dark:text-white text-2xl font-title font-bold"
      >
        {{ store.selected()?.subject?.name }}
      </h2>
      <h4
        class="leading-tight tracking-tight flex text-gray-400 dark:text-white text-lg font-title font-semibold"
      >
        {{ store.selected()?.plan?.name }}
      </h4>
    </div>

    <div class="mt-2" skooltrak-tabs>
      <sk-tabs-item link="schedule">
        <icon name="calendar-days" />
        {{ 'Schedule' | translate }}</sk-tabs-item
      >
    </div>
    <router-outlet></router-outlet>
  </sk-card>`,
})
export class CourseDetailsComponent implements OnInit {
  @Input() id?: string;

  public store = inject(CoursesStore);

  ngOnInit(): void {
    this.store.patchState({ selectedId: this.id });
  }
}
