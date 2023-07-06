import { IconsModule } from '@amithvns/ng-heroicons';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AfterViewInit, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { Course } from '@skooltrak/models';
import {
  ButtonDirective,
  CardComponent,
  SelectComponent,
  UsersSelectorComponent,
} from '@skooltrak/ui';

import { PlansCoursesFormStore } from './plans-courses-form.store';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    IconsModule,
    ReactiveFormsModule,
    SelectComponent,
    ButtonDirective,
    UsersSelectorComponent,
  ],
  providers: [provideComponentStore(PlansCoursesFormStore)],
  styles: [
    `
      input,
      select,
      textarea {
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
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title text-xl text-gray-700 dark:text-gray-100 font-semibold mb-4"
      >
        {{ 'Course.Details' | translate }}
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
        <label class="label" for="subject_id">{{
          'Subjects.Label' | translate
        }}</label>
        <sk-select
          label="name"
          [items]="store.subjects()"
          formControlName="subject_id"
        />
      </div>
      <div>
        <label class="label" for="weekly_hours">{{
          'Teachers' | translate
        }}</label>
        <sk-users-selector />
      </div>
      <div>
        <label class="label" for="weekly_hours">{{
          'Weekly hours' | translate
        }}</label>
        <input formControlName="weekly_hours" type="number" />
      </div>
      <div>
        <label class="label" for="description">{{
          'Description' | translate
        }}</label>
        <textarea formControlName="description"></textarea>
      </div>
      <div class="flex justify-end">
        <button skButton color="sky" type="submit">
          {{ 'Save changes' | translate }}
        </button>
      </div>
    </form>
  </sk-card>`,
})
export class PlanCoursesFormComponent implements AfterViewInit {
  public store = inject(PlansCoursesFormStore);
  public dialogRef = inject(DialogRef<Partial<Course>>);
  private data: Course | undefined = inject(DIALOG_DATA);

  form = new FormGroup({
    subject_id: new FormControl<string | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    weekly_hours: new FormControl<number>(0, {
      nonNullable: true,
    }),
    description: new FormControl<string>('', { nonNullable: true }),
  });

  ngAfterViewInit(): void {
    !!this.data && this.form.patchValue(this.data);
  }

  saveChanges() {
    this.dialogRef.close(this.form.getRawValue());
  }
}
