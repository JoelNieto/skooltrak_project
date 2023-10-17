import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { Course } from '@skooltrak/models';
import { ButtonDirective, CardComponent, SelectComponent } from '@skooltrak/ui';

import { UsersSelectorComponent } from '../../components/users-selector/users-selector.component';
import { CoursesFormStore } from './courses-form.store';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    NgIconComponent,
    ReactiveFormsModule,
    SelectComponent,
    ButtonDirective,
    UsersSelectorComponent,
  ],
  providers: [
    provideComponentStore(CoursesFormStore),
    provideIcons({ heroXMark }),
  ],
  styles: [
    `
      input,
      select,
      textarea {
        @apply block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm;
        &.ng-invalid.ng-dirty {
          @apply border-red-400 bg-red-100 text-red-800 focus:border-red-600 focus:ring-red-600;
        }
      }

      label {
        @apply mb-2 block font-sans text-sm font-medium text-gray-600 dark:text-white;
      }
    `,
  ],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'Course.Details' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <ng-icon
          name="heroXMark"
          size="24"
          class="text-gray-700 dark:text-gray-100"
        />
      </button>
    </div>
    <form
      [formGroup]="form"
      class="flex flex-col space-y-3"
      (ngSubmit)="saveChanges()"
    >
      <div>
        <label class="label" for="plan_id">{{ 'Plan' | translate }}</label>
        <sk-select
          label="name"
          [items]="store.PLANS()"
          formControlName="plan_id"
        />
      </div>
      <div>
        <label class="label" for="subject_id">{{
          'Subjects.Label' | translate
        }}</label>
        <sk-select
          label="name"
          [items]="store.SUBJECTS()"
          formControlName="subject_id"
        />
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
        <button skButton color="sky" type="submit" [disabled]="form.invalid">
          {{ 'Save changes' | translate }}
        </button>
      </div>
    </form>
  </sk-card>`,
})
export class SchoolCoursesFormComponent implements OnInit {
  public store = inject(CoursesFormStore);
  public dialogRef = inject(DialogRef<Partial<Course>>);
  private data: Course | undefined = inject(DIALOG_DATA);

  public form = new FormGroup({
    plan_id: new FormControl<string | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    subject_id: new FormControl<string | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    weekly_hours: new FormControl<number>(0, {
      nonNullable: true,
    }),
    description: new FormControl<string>('', { nonNullable: true }),
  });

  public ngOnInit(): void {
    !!this.data && this.form.patchValue(this.data);
  }

  public saveChanges(): void {
    this.dialogRef.close(this.form.getRawValue());
  }
}
