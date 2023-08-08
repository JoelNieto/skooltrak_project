import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { authState } from '@skooltrak/auth';
import { ButtonDirective } from '@skooltrak/ui';

@Component({
  selector: 'sk-sign-in',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    ButtonDirective,
    NgOptimizedImage,
  ],
  template: `<div class="w-min-screen flex h-screen">
    <section
      class="w-full flex-none bg-gray-100 font-sans dark:bg-gray-800 md:w-1/2 lg:w-1/3"
    >
      <div
        class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0"
      >
        <a
          href="#"
          class="font-title mb-6 flex items-center text-2xl text-gray-900 dark:text-white"
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
        <div
          class="w-full space-y-4 rounded-lg bg-white p-6 dark:border dark:border-gray-700 dark:bg-gray-600 sm:max-w-md sm:p-8 md:mt-0 md:space-y-6"
        >
          <h1
            class="font-title text-xl leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
          >
            Sign in to your account
          </h1>
          <form
            class="space-y-4 md:space-y-6"
            [formGroup]="form"
            (ngSubmit)="signIn()"
          >
            <div>
              <label for="email" class="label">Your email</label>
              <input
                formControlName="email"
                type="email"
                name="email"
                id="email"
                class="input"
                autocomplete="email"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label class="label">Password</label>
              <input
                formControlName="password"
                autocomplete="current-password"
                class="input"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                required=""
              />
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-start">
                <div class="flex h-5 items-center">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    class="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-sky-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-sky-600"
                    required=""
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="remember" class="text-gray-500 dark:text-gray-300"
                    >Remember me</label
                  >
                </div>
              </div>
              <a
                href="#"
                class="text-sm font-medium text-sky-600 hover:underline dark:text-sky-500"
                >Forgot password?</a
              >
            </div>
            <button
              skButton
              color="sky"
              type="submit"
              [disabled]="form.invalid"
              class="w-full "
            >
              Sign in
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-300">
              Don’t have an account yet?
              <a
                class="font-medium text-sky-600 hover:underline dark:text-sky-500"
                routerLink="../sign-up"
                >Sign up</a
              >
            </p>
          </form>
        </div>
      </div>
    </section>
    <div class="bg grow"></div>
  </div> `,
  styles: [
    `
      .bg {
        background-image: url('/assets/sign-in-bg.jpg');
        background-size: cover;
      }

      .input {
        @apply block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm;
        &.ng-invalid.ng-dirty {
          @apply border-red-400 bg-red-100 text-red-800 focus:border-red-600 focus:ring-red-600;
        }
      }

      .label {
        @apply mb-2 block font-sans text-sm font-medium text-gray-500 dark:text-white;
      }
    `,
  ],
})
export class SignInComponent {
  private auth = inject(authState.AuthStateFacade);

  form = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
  });

  async signIn() {
    const { email, password } = this.form.getRawValue();
    this.auth.signIn(email, password);
  }
}
