import { IconsModule } from '@amithvns/ng-heroicons';
import { DialogRef } from '@angular/cdk/dialog';
import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
    IconsModule,
    UsersSelectorComponent,
  ],
  providers: [provideComponentStore(TeachersFormStore)],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title text-xl text-gray-700 dark:text-gray-100 font-semibold mb-4"
      >
        {{ 'Teacher.Details' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <icon name="x-mark" class="text-gray-700 dark:text-gray-100" />
      </button>
    </div>
    <form
      [formGroup]="form"
      class="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-4 mt-2"
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
