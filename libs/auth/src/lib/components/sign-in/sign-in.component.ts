import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'skooltrak-sign-in',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule, NgOptimizedImage],
  providers: [SupabaseService],
  template: `<div class="w-min-screen h-screen flex">
    <section
      class="bg-gray-100 dark:bg-gray-800 flex-none w-full md:w-1/2 lg:w-1/3 font-sans"
    >
      <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
      >
        <a
          href="#"
          class="flex items-center mb-6 text-2xl font-mono text-gray-900 dark:text-white"
        >
          <img
            class="w-12 h-12 mr-2"
            width="40"
            height="40"
            loading="lazy"
            ngSrc="assets/skooltrak-logo.svg"
            alt="logo"
          />
          SKOOLTRAK
        </a>
        <div
          class="w-full bg-white rounded-lg p-6 space-y-4 md:space-y-6 sm:p-8 dark:border md:mt-0 sm:max-w-md dark:bg-gray-600 dark:border-gray-700"
        >
          <h1
            class="text-xl font-bold font-mono leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
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
                <div class="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-sky-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-sky-600 dark:ring-offset-gray-800"
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
              type="submit"
              [disabled]="form.invalid"
              class="w-full text-white disabled:opacity-75 disabled:cursor-not-allowed bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
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
    <div class="grow bg"></div>
  </div> `,
  styles: [
    `
      .bg {
        background-image: url('/assets/sign-in-bg.jpg');
        background-size: cover;
      }

      .input {
        @apply bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500;
        &.ng-invalid.ng-dirty {
          @apply text-red-800 border-red-400 bg-red-100 focus:ring-red-600 focus:border-red-600;
        }
      }

      .label {
        @apply block mb-2 text-sm font-sans text-gray-500 font-medium dark:text-white;
      }
    `,
  ],
})
export class SignInComponent {
  private supabase = inject(SupabaseService);

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
    const {
      data: { user },
      error,
    } = await this.supabase.signInWithEmail(email, password);
    if (error) console.info(error);
    console.log(user);
  }
}
