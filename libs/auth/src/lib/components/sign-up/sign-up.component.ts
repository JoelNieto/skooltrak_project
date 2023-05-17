import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PasswordValidators } from '../../services/password.validator';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'skooltrak-sign-up',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <section class="bg-gray-100 font-sans dark:bg-gray-800">
      <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
      >
        <a
          href="#"
          class="flex items-center text-2xl font-semibold mb-6 text-gray-900 dark:text-white"
        >
          <img
            class="w-10 h-10 mr-2"
            src="https://www.skooltrak.com/assets/img/logo.png"
            alt="logo"
          />
          Skooltrak
        </a>
        <form
          [formGroup]="form"
          (ngSubmit)="saveChanges()"
          class="w-full bg-white rounded-xl p-6 space-y-4 md:space-y-6 shadow-xl md:mt-0 sm:max-w-lg dark:bg-gray-600 dark:border-gray-700"
        >
          <h1
            class="text-xl font-bold leading-tight font-mono md:text-2xl dark:text-white"
          >
            Create your personal account
          </h1>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label
                class="block mb-2 font-sans text-gray-700 font-medium dark:text-white"
                for="full_name"
                >Name</label
              >
              <input
                type="text"
                name="full_name"
                class="input"
                formControlName="full_name"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label
                class="block mb-2 font-sans text-gray-700 font-medium dark:text-white"
                for="email"
                >Email</label
              >
              <input
                type="email"
                name="email"
                class="input"
                formControlName="email"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label
                class="block mb-2 font-sans text-gray-700 font-medium dark:text-white"
                for="password"
                >Password</label
              >
              <input
                type="password"
                name="password"
                autocomplete="new-password"
                formControlName="password"
                class="input"
                placeholder="•••••••••"
              />
            </div>
            <div>
              <label
                class="block mb-2 font-sans text-gray-700 font-medium dark:text-white"
                for="confirm-password"
                >Confirm password</label
              >
              <input
                type="password"
                name="confirm-password"
                formControlName="confirm_password"
                autocomplete="new-password"
                class="input"
                placeholder="•••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            [disabled]="form.invalid"
            class="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800 disabled:bg-blue-400 disabled:dark:bg-blue-400 disabled:cursor-not-allowed"
          >
            Create account
          </button>
          <p class="text-sm font-light text-gray-500 dark:text-gray-300">
            Do you have an account already?
            <a class="font-medium text-sky-600  hover:underline" routerLink="/"
              >Sign in</a
            >
          </p>
        </form>
      </div>
    </section>
  `,
  styles: [
    `
      .input {
        @apply bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 shadow-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
      }
    `,
  ],
})
export class SignUpComponent {
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

  profile = toSignal(this.supabase.profile);

  constructor() {
    effect(() => {
      this.form.patchValue(this.profile()!);
      this.form.get('email')?.disable();
    });
  }

  async saveChanges() {
    const { email, password, full_name } = this.form.getRawValue();
    const { data, error } = await this.supabase.updateUser({
      id: this.profile()?.id,
      email,
      password,
      full_name,
    });
    console.log(data);
    console.log(error);
  }
}
