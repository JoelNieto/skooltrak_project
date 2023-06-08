import { IconsModule } from '@amithvns/ng-heroicons';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { StudyPlan } from '@skooltrak/models';
import { ButtonComponent, CardComponent, SelectComponent } from '@skooltrak/ui';
import { filter } from 'rxjs';

import { PlansFormStore } from './study-plans-form.store';

@Component({
  selector: 'skooltrak-plans-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    IconsModule,
    SelectComponent,
    ButtonComponent,
  ],
  providers: [provideComponentStore(PlansFormStore)],
  styles: [
    `
      input,
      select {
        @apply bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500;
        &.ng-invalid.ng-dirty {
          @apply text-red-800 border-red-400 bg-red-100 focus:ring-red-600 focus:border-red-600;
        }
      }

      label {
        @apply block mb-2 text-sm font-sans text-gray-600 font-medium dark:text-white;
      }
    `,
  ],
  template: `<skooltrak-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title text-xl text-gray-700 dark:text-gray-100 font-semibold mb-4"
      >
        {{ 'Plans.Details' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <icon name="x-mark" class="text-gray-700 dark:text-gray-100" />
      </button>
    </div>
    <form
      [formGroup]="form"
      class="flex flex-col space-y-3"
      (ngSubmit)="saveChanges()"
    >
      <div>
        <label for="name">{{ 'Name' | translate }}</label>
        <input type="text" formControlName="name" />
      </div>
      <div>
        <label for="degree_id">{{ 'Degree' | translate }}</label>
        <skooltrak-select
          [items]="store.degrees()"
          label="name"
          formControlName="degree_id"
        />
      </div>
      <div>
        <label for="year">{{ 'Year' | translate }}</label>
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
        <button
          skooltrak-button
          color="sky"
          type="submit"
          [disabled]="form.invalid"
        >
          {{ 'Save changes' | translate }}
        </button>
      </div>
    </form>
  </skooltrak-card>`,
})
export class StudyPlansFormComponent implements OnInit {
  public dialogRef = inject(DialogRef<Partial<StudyPlan>>);
  private data: StudyPlan | undefined = inject(DIALOG_DATA);
  store = inject(PlansFormStore);
  form = new FormGroup({
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

  ngOnInit(): void {
    this.form
      .get('degree_id')
      ?.valueChanges.pipe(filter((val) => !!val))
      .subscribe({
        next: (id) => {
          this.form
            .get('level_id')
            ?.setValue(
              this.store.degrees().find((x) => x.id === id)?.level_id!
            );
        },
      });
    !!this.data && this.form.patchValue(this.data);
  }

  saveChanges() {
    this.dialogRef.close(this.form.getRawValue());
  }
}
