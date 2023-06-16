import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';

import { TeachersFormStore } from './teachers-form.store';

@Component({
  selector: 'sk-admin-teachers-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  providers: [provideComponentStore(TeachersFormStore)],
  template: ` <form
    [formGroup]="form"
    class="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4 mt-2"
  >
    <div>
      <label for="first_name">First name</label>
      <input type="text" formControlName="first_name" />
    </div>
    <div>
      <label for="middle_name">Middle name</label>
      <input type="text" formControlName="middle_name" />
    </div>
    <div>
      <label for="father_name">Father name</label>
      <input type="text" formControlName="father_name" />
    </div>
    <div>
      <label for="mother_name">Mother name</label>
      <input type="text" formControlName="mother_name" />
    </div>
    <div>
      <label for="birth_date">Birth date</label>
      <input type="date" formControlName="birth_date" />
    </div>
    <div>
      <label for="gender">Gender</label>
      <select formControlName="gender">
        <option *ngFor="let gender of store.genders()" [value]="gender.id">
          {{ gender.name }}
        </option>
      </select>
    </div>
  </form>`,
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
}
