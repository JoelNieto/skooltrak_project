import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { Period } from '@skooltrak/models';
import { ButtonDirective, CardComponent, LabelDirective } from '@skooltrak/ui';
import { format } from 'date-fns';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    ReactiveFormsModule,
    NgIconComponent,
    TranslateModule,
    LabelDirective,
    ButtonDirective,
  ],
  providers: [provideIcons({ heroXMark })],
  styles: [
    `
      input {
        @apply block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm;
        &.ng-invalid.ng-dirty {
          @apply border-red-400 bg-red-100 text-red-800 focus:border-red-600 focus:ring-red-600;
        }
      }
    `,
  ],
  template: `<sk-card>
    <div class="mb-3 flex items-start justify-between" header>
      <h3
        class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'PERIODS.DETAILS' | translate }}
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
      (ngSubmit)="saveChanges()"
      class="flex flex-col space-y-3"
    >
      <div>
        <label for="name" skLabel>{{ 'Name' | translate }}</label>
        <input type="text" formControlName="name" />
      </div>
      <div>
        <label for="year" skLabel>{{ 'PERIODS.YEAR' | translate }}</label>
        <input type="number" formControlName="year" />
      </div>
      <div>
        <label for="start_at" skLabel>{{
          'PERIODS.START_AT' | translate
        }}</label>
        <input type="date" formControlName="start_at" />
      </div>
      <div>
        <label for="end_at" skLabel>{{ 'PERIODS.END_AT' | translate }}</label>
        <input type="date" formControlName="end_at" />
      </div>
      <div class="flex justify-end">
        <button skButton color="sky" type="submit">
          {{ 'Save changes' | translate }}
        </button>
      </div>
    </form>
  </sk-card>`,
})
export class SchoolPeriodsFormComponent implements OnInit {
  public dialogRef = inject(DialogRef<Partial<Period>>);

  public data: Period | undefined = inject(DIALOG_DATA);

  public form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    year: new FormControl(new Date().getUTCFullYear(), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    start_at: new FormControl(format(new Date(), 'yyyy-MM-dd'), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    end_at: new FormControl(format(new Date(), 'yyyy-MM-dd'), {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    !!this.data && this.form.patchValue(this.data);
  }

  public saveChanges(): void {
    this.dialogRef.close(this.form.getRawValue());
  }
}
