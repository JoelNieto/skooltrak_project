import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectComponent } from '@skooltrak/ui';

@Component({
  selector: 'sk-admin-student-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, SelectComponent],
  template: `<form
    [formGroup]="form"
    class="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4"
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
      <label for="mother_name">Mother name</label>
      <sk-select
        [items]="[{ name: 'Panama' }, { name: 'Italia' }]"
        label="name"
      />
    </div>
  </form>`,
  styles: [
    `
      input {
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
export class StudentFormComponent {
  form = new FormGroup({
    first_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    middle_name: new FormControl('', { nonNullable: true }),
    father_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    mother_name: new FormControl('', { nonNullable: true }),
    birth_date: new FormControl<Date | null>(null),
    country_id: new FormControl<string>('', { nonNullable: true }),
    gender_id: new FormControl<number | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    admission_status: new FormControl<number>(1, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
}
