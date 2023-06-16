import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RoleTypeEnum } from '@skooltrak/models';
import { ButtonComponent, SelectComponent } from '@skooltrak/ui';

import { SignUpStore } from '../sign-up/sign-up.store';

@Component({
  selector: 'sk-role-selector',
  standalone: true,
  imports: [
    SelectComponent,
    ButtonComponent,
    RouterLink,
    TranslateModule,
    ReactiveFormsModule,
  ],
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
  template: `<div
    class="w-full space-y-4 md:space-y-6 md:mt-0 sm:min-w-[36rem]"
  >
    <h1
      class="text-xl leading-tight font-semibold font-sans text-gray-400 md:text-2xl dark:text-white"
    >
      Connect to your school
    </h1>
    <form class="flex flex-col gap-4" [formGroup]="form">
      <div>
        <label for="school">School</label>
        <skooltrak-select
          [items]="store.schools()"
          label="full_name"
          itm
          formControlName="school_id"
        />
      </div>
      <div>
        <label for="email"> Email </label>
        <input type="email" formControlName="email" autocomplete="username" />
      </div>
      <div>
        <label for="role">Role</label>
        <select>
          <option disabled selected>Select a role</option>
          <option value="admin">Administrator</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
        </select>
      </div>

      <button skooltrak-button type="submit" color="sky" class="w-full">
        Create account
      </button>

      <p class="text-sm font-light text-gray-500 dark:text-gray-300">
        Do you have an account already?
        <a class="font-medium text-sky-600  hover:underline" routerLink="/"
          >Sign in</a
        >
      </p>
    </form>
  </div>`,
})
export class RoleSelectorComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    role: new FormControl<RoleTypeEnum | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    school_id: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  store = inject(SignUpStore);
}
