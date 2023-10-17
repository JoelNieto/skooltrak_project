import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { StudyPlan } from '@skooltrak/models';
import { ButtonDirective, CardComponent, LabelDirective, SelectComponent } from '@skooltrak/ui';
import { filter } from 'rxjs';

import { PlansFormStore } from './plans-form.store';

@Component({
  selector: 'sk-admin-plans-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgIconComponent,
    SelectComponent,
    ButtonDirective,
    LabelDirective,
  ],
  providers: [
    provideComponentStore(PlansFormStore),
    provideIcons({ heroXMark }),
  ],
  styles: [
    `
      input,
      select {
        @apply block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm;
        &.ng-invalid.ng-dirty {
          @apply border-red-400 bg-red-100 text-red-800 focus:border-red-600 focus:ring-red-600;
        }
      }
    `,
  ],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'Plans.Details' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <ng-icon
          name="heroXMark"
          class="text-gray-700 dark:text-gray-100"
          size="24"
        />
      </button>
    </div>
    <form
      [formGroup]="form"
      class="flex flex-col space-y-3"
      (ngSubmit)="saveChanges()"
    >
      <div>
        <label for="name" skLabel>{{ 'Name' | translate }}</label>
        <input type="text" formControlName="name" />
      </div>
      <div>
        <label for="degree_id" skLabel>{{ 'Degree' | translate }}</label>
        <sk-select
          [items]="store.DEGREES()"
          label="name"
          formControlName="degree_id"
        />
      </div>
      <div>
        <label for="year" skLabel>{{ 'Year' | translate }}</label>
        <select label="name" formControlName="year">
          <option [value]="-1">Pre-Kinder</option>
          <option [value]="0">Kinder</option>
          <option [value]="1">1</option>
          <option [value]="2">2</option>
          <option [value]="3">3</option>
          <option [value]="4">4</option>
          <option [value]="5">5</option>
          <option [value]="6">6</option>
          <option [value]="7">7</option>
          <option [value]="8">8</option>
          <option [value]="9">9</option>
          <option [value]="10">10</option>
          <option [value]="11">11</option>
          <option [value]="12">12</option>
        </select>
      </div>
      <div class="flex justify-end">
        <button skButton color="sky" type="submit" [disabled]="form.invalid">
          {{ 'Save changes' | translate }}
        </button>
      </div>
    </form>
  </sk-card>`,
})
export class StudyPlansFormComponent implements OnInit {
  public dialogRef = inject(DialogRef<Partial<StudyPlan>>);
  private data: StudyPlan | undefined = inject(DIALOG_DATA);
  public store = inject(PlansFormStore);
  public form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    level_id: new FormControl<string>('', {
      nonNullable: true,
    }),
    degree_id: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    year: new FormControl<number | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public ngOnInit(): void {
    this.form
      .get('degree_id')
      ?.valueChanges.pipe(filter((val) => !!val))
      .subscribe({
        next: (id) => {
          const value = this.store.DEGREES().find((x) => x.id === id);
          !!value && this.form.get('level_id')?.setValue(value.level_id);
        },
      });
    !!this.data && this.form.patchValue(this.data);
  }

  public saveChanges(): void {
    this.dialogRef.close(this.form.getRawValue());
  }
}
