import { AsyncPipe, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent, SelectComponent, TabsComponent, TabsItemComponent } from '@skooltrak/ui';

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
  template: `<skooltrak-card>
    <div header>
      <h2
        class="sticky pb-2 leading-tight tracking-tight flex text-gray-700 dark:text-white text-2xl font-title font-bold"
      >
        {{ 'Plans.Title' | translate }}
      </h2>
      <div class="w-80">
        <skooltrak-select
          [items]="store.plans()"
          label="name"
          secondaryLabel="degree.name"
          [formControl]="planControl"
        />
      </div>
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
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.planControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (selectedId) => {
          !!selectedId && this.store.patchState({ selectedId });
        },
      });
  }
}
