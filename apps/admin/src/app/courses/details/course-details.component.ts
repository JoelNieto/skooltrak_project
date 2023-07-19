import { IconsModule } from '@amithvns/ng-heroicons';
import { Component, effect, inject, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '@skooltrak/models';
import { CardComponent, TabsComponent, TabsItemComponent, UsersSelectorComponent } from '@skooltrak/ui';
import { pairwise, startWith } from 'rxjs';

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
    UsersSelectorComponent,
    ReactiveFormsModule,
  ],
  template: `<sk-card>
    <div header>
      <a
        routerLink="../all"
        class="mb-2 flex font-sans text-sm leading-tight tracking-tight text-gray-300 dark:text-white"
      >
        < Back
      </a>
      <div class="justify-between md:flex">
        <div>
          <h2
            class="font-title mb-1 flex text-2xl font-bold leading-tight tracking-tight text-gray-700 dark:text-white"
          >
            {{ store.selected()?.subject?.name }}
          </h2>

          <h4
            class="flex font-sans text-lg font-semibold leading-tight tracking-tight text-gray-400 dark:text-white"
          >
            {{ store.selected()?.plan?.name }}
          </h4>
        </div>

        <div class="w-80">
          <h5
            class="mb-1 block font-sans text-sm font-medium text-gray-600 dark:text-white"
          >
            {{ 'Teachers' | translate }}
          </h5>
          <sk-users-selector [formControl]="teacherControl" />
        </div>
      </div>
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

  teacherControl = new FormControl<Partial<User>[]>([], { nonNullable: true });

  constructor() {
    effect(
      () => {
        const teachers = this.store.selected()?.teachers;
        !!teachers && this.teacherControl.setValue(teachers);
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this.store.patchState({ selectedId: this.id });
    this.teacherControl.valueChanges.pipe(startWith([]), pairwise()).subscribe({
      next: ([prev, value]) => {
        console.info('prev', prev);
        console.info('next', value);
      },
    });
  }
}
