import { DialogRef } from '@angular/cdk/dialog';
import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { Teacher } from '@skooltrak/models';
import { CardComponent, UsersSelectorComponent } from '@skooltrak/ui';

import { TeachersFormStore } from './teachers-form.store';

@Component({
  selector: 'sk-admin-teachers-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgFor,
    CardComponent,
    TranslateModule,
    NgIconComponent,
    UsersSelectorComponent,
  ],
  providers: [
    provideComponentStore(TeachersFormStore),
    provideIcons({ heroXMark }),
  ],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'Teacher.Details' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <ng-icon name="heroXMark" class="text-gray-700 dark:text-gray-100" />
      </button>
    </div>
    <form
      [formGroup]="form"
      class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2"
    >
      <div>
        <label for="first_name">First name</label>
        <sk-users-selector />
      </div>
      <div>
        <label for="middle_name">Middle name</label>
        <input type="text" formControlName="middle_name" />
      </div></form
  ></sk-card> `,
  styles: [
    `
      input,
      select {
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
})
export class TeachersFormComponent {
  store = inject(TeachersFormStore);
  form = new FormGroup({
    first_name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    middle_name: new FormControl<string>('', { nonNullable: true }),
    father_name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    mother_name: new FormControl<string>('', { nonNullable: true }),
    gender: new FormControl<number | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    birth_date: new FormControl<Date | undefined>(undefined, {
      nonNullable: true,
    }),
  });
  dialogRef = inject(DialogRef<Partial<Teacher>>);
}
