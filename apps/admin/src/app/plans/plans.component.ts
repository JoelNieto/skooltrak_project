import { AsyncPipe, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { asapScheduler } from 'rxjs';

import { PlansStore } from './plans.store';

@Component({
  selector: 'sk-admin-plans',
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
  template: `<sk-card>
    <div header>
      <h2
        class="font-title sticky flex pb-2 text-2xl font-bold leading-tight tracking-tight text-gray-700 dark:text-white"
      >
        {{ 'Plans.Title' | translate }}
      </h2>
      <div class="w-80">
        <sk-select
          [items]="store.plans()"
          label="name"
          secondaryLabel="degree.name"
          [formControl]="planControl"
        />
      </div>
    </div>
    <ng-container *ngIf="store.selectedId$ | async">
      <div skooltrak-tabs>
        <sk-tabs-item link="courses">{{ 'Courses' | translate }}</sk-tabs-item>
        <sk-tabs-item link="students">{{
          'Students' | translate
        }}</sk-tabs-item>
      </div>
      <router-outlet />
    </ng-container>
  </sk-card>`,
})
export class PlansComponent implements OnInit {
  store = inject(PlansStore);
  planControl = new FormControl<string | undefined>(undefined);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.planControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (selectedId) => {
          !!selectedId &&
            asapScheduler.schedule(() => this.store.patchState({ selectedId }));
        },
      });
  }
}
