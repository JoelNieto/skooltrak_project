import { IconsModule } from '@amithvns/ng-heroicons';
import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '@skooltrak/auth';
import { ButtonDirective, CardComponent } from '@skooltrak/ui';
import { AuthActions } from 'libs/auth/src/lib/state';

import { SignUpStore } from './sign-up.store';

@Component({
  selector: 'sk-sign-up',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgOptimizedImage,
    ButtonDirective,
    IconsModule,
    RouterOutlet,
    CardComponent,
    TranslateModule,
    ReactiveFormsModule,
  ],
  providers: [provideComponentStore(SignUpStore)],
  template: `
    <div
      class="flex min-h-screen w-screen flex-col items-center justify-center bg-gray-100 px-8 dark:bg-gray-700"
    >
      <a
        href="#"
        class="font-title mb-6 flex items-center text-2xl text-gray-900 dark:text-gray-100"
      >
        <img
          class="mr-2 h-12 w-12"
          width="40"
          height="40"
          loading="lazy"
          ngSrc="assets/skooltrak-logo.svg"
          alt="logo"
        />
        SKOOLTRAK
      </a>
      <sk-card class="w-full md:w-2/5 xl:w-1/3">
        <h1 class="font-title text-2xl text-gray-700 dark:text-gray-100" header>
          Sign up
        </h1>
        <h3 class="font-sans text-gray-500 dark:text-gray-300" header>
          Provide your personal information
        </h3>
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div>
            <label for="first_name">First name</label>
            <input
              type="text"
              name="first_name"
              placeholder="John"
              formControlName="first_name"
            />
          </div>
          <div>
            <label for="first_name">Father name</label>
            <input
              type="text"
              name="father_name"
              placeholder="Doe"
              formControlName="father_name"
            />
          </div>
          <div>
            <label for="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="user@domain.com"
              formControlName="email"
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

          <div class="md:col-span-2">
            <button
              class="w-full md:w-auto"
              skButton
              color="green"
              type="submit"
              [disabled]="form.invalid"
            >
              Confirm changes
            </button>
          </div>
        </form>
        <p class="mt-4 text-sm font-light text-gray-500 dark:text-gray-300">
          Do you have an account already?
          <a
            class="font-medium text-sky-600 hover:underline dark:text-sky-500"
            routerLink="../sign-in"
            >Sign in</a
          >
        </p>
      </sk-card>
    </div>
  `,
  styles: [
    `
      input {
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
export class SignUpComponent {
  supabase = inject(SupabaseService);
  store$ = inject(Store);
  router = inject(Router);
  form = new FormGroup({
    first_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    father_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  async onSubmit() {
    const { father_name, first_name, email, password } =
      this.form.getRawValue();
    const { data, error } = await this.supabase.signUp({
      email,
      password,
      first_name,
      father_name,
    });

    if (error) {
      console.error(error.message);
      return;
    }

    console.info(data);

    this.store$.dispatch(AuthActions.setSession({ session: data?.session }));
  }
}
