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
    <h2
      class="sticky pb-2 leading-tight tracking-tight flex text-gray-700 dark:text-white text-2xl font-title font-bold"
      header
    >
      {{ 'Plans.Title' | translate }}
    </h2>
    <skooltrak-select
      [items]="store.plans()"
      label="name"
      secondaryLabel="degree.name"
      [formControl]="planControl"
    />
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
