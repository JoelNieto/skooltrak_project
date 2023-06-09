import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent, SelectComponent } from '@skooltrak/ui';

import { PlansStore } from './plans.store';

@Component({
  selector: 'skooltrak-plans',
  standalone: true,
  imports: [
    CardComponent,
    SelectComponent,
    TranslateModule,
    ReactiveFormsModule,
  ],
  providers: [provideComponentStore(PlansStore)],
  template: `<skooltrak-card>
    <div header>
      <h2
        class="sticky pb-2 leading-tight tracking-tight flex text-gray-700 dark:text-white text-2xl font-title font-bold"
      >
        {{ 'Plans.Title' | translate }}
      </h2>
      <skooltrak-select
        [items]="store.plans()"
        label="name"
        secondaryLabel="degree.name"
        [formControl]="planControl"
      />
    </div>
    <div
      class="text-sm font-medium text-center text-gray-500 border-b font-title border-gray-200 dark:text-gray-400 mb-2 dark:border-gray-700"
    >
      <ul class="flex flex-wrap -mb-px">
        <li class="mr-2">
          <a routerLink="settings" routerLinkActive="active" class="link">{{
            'Settings' | translate
          }}</a>
        </li>
        <li class="mr-2">
          <a routerLink="degrees" routerLinkActive="active" class="link">{{
            'Degrees.Title' | translate
          }}</a>
        </li>
        <li class="mr-2">
          <a routerLink="subjects" routerLinkActive="active" class="link">{{
            'Subjects.Title' | translate
          }}</a>
        </li>
        <li class="mr-2">
          <a routerLink="plans" routerLinkActive="active" class="link">{{
            'Plans.Title' | translate
          }}</a>
        </li>
      </ul>
    </div>
  </skooltrak-card>`,
})
export class PlansComponent implements OnInit {
  store = inject(PlansStore);
  planControl = new FormControl<string | undefined>(undefined);
  ngOnInit(): void {
    this.planControl.valueChanges.subscribe({
      next: (selectedId) =>
        !!selectedId && this.store.patchState({ selectedId }),
    });
  }
}
