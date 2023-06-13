import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import {
  CardComponent,
  SelectComponent,
  TabsComponent,
  TabsItemComponent,
} from '@skooltrak/ui';

import { PlansStore } from './plans.store';

@Component({
  selector: 'skooltrak-plans',
  standalone: true,
  imports: [
    CardComponent,
    SelectComponent,
    TranslateModule,
    ReactiveFormsModule,
    TabsItemComponent,
    TabsComponent,
    RouterOutlet,
    NgIf,
    AsyncPipe,
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
    <ng-container *ngIf="store.selectedId$ | async">
      <div skooltrak-tabs>
        <skooltrak-tabs-item route="courses">{{
          'Courses' | translate
        }}</skooltrak-tabs-item>
        <skooltrak-tabs-item route="students">{{
          'Students' | translate
        }}</skooltrak-tabs-item>
      </div>
      <router-outlet />
    </ng-container>
  </skooltrak-card>`,
})
export class PlansComponent implements OnInit {
  store = inject(PlansStore);
  planControl = new FormControl<string | undefined>(undefined);

  ngOnInit(): void {
    this.planControl.valueChanges.subscribe({
      next: (selectedId) => {
        !!selectedId && this.store.patchState({ selectedId });
      },
    });
  }
}
