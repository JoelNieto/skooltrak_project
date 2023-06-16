import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordValidators, SupabaseService } from '@skooltrak/auth';
import { ButtonComponent } from '@skooltrak/ui';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
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
  template: ` <form
    [formGroup]="form"
    class="w-full space-y-4 md:space-y-6 md:mt-0 sm:min-w-[36rem]"
  >
    <h1
      class="text-xl font-bold leading-tight font-title text-sky-900 md:text-2xl dark:text-white"
    >
      Personal data
    </h1>
    <div class="grid grid-cols-1 gap-4">
      <div>
        <label for="full_name">Name</label>
        <input
          type="text"
          name="full_name"
          formControlName="full_name"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label for="email">Email</label>
        <input
          type="email"
          name="email"
          formControlName="email"
          placeholder="name@company.com"
        />
      </div>
      <div>
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          autocomplete="new-password"
          formControlName="password"
          placeholder="•••••••••"
        />
      </div>
      <div>
        <label for="confirm-password">Confirm password</label>
        <input
          type="password"
          name="confirm-password"
          formControlName="confirm_password"
          autocomplete="new-password"
          placeholder="•••••••••"
        />
      </div>
    </div>
    <button
      skooltrak-button
      type="submit"
      [disabled]="form.invalid"
      color="blue"
      class="w-full"
    >
      Create account
    </button>
    <p class="text-sm font-light text-gray-500 dark:text-gray-300">
      Do you have an account already?
      <a class="font-medium text-sky-600  hover:underline" routerLink="/"
        >Sign in</a
      >
    </p>
  </form>`,
})
export class PersonalDataComponent {
  private supabase = inject(SupabaseService);
  form = new FormGroup(
    {
      full_name: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirm_password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
    },
    { validators: PasswordValidators.matchValidator }
  );

  async saveChanges() {
    const { email, password, full_name } = this.form.getRawValue();
    const { data, error } = await this.supabase.updateUser({
      id: '',
      email,
      password,
      full_name,
    });
    console.log(data);
    console.log(error);
  }
}
