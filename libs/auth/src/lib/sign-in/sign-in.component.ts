import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { InputComponent } from '@skooltrak/ui';

@Component({
  selector: 'skooltrak-sign-in',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    InputComponent,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
  ],
  template: `<section class="bg-gray-50 dark:bg-gray-800 font-sans">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <a
        href="#"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img
          class="w-8 h-8 mr-2"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
          alt="logo"
        />
        Skooltrak
      </a>
      <div
        class="w-full bg-white rounded-xl p-6 space-y-4 md:space-y-6 sm:p-8 shadow-xl dark:border md:mt-0 sm:max-w-md dark:bg-gray-600 dark:border-gray-700"
      >
        <h1
          class="text-xl font-bold font-mono  leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
        >
          Sign in to your account
        </h1>
        <form class="space-y-4 md:space-y-6" action="#">
          <div>
            <label
              for="email"
              class="block mb-2 text-sm font-sans font-medium text-gray-600 dark:text-white"
              >Your email</label
            >
            <input
              type="email"
              name="email"
              id="email"
              class="input"
              placeholder="name@company.com"
              required=""
            />
          </div>
          <div>
            <label
              class="block mb-2 font-sans text-gray-500 font-medium dark:text-white"
              >Password</label
            >
            <input
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
            class="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
          >
            Sign in
          </button>
          <p class="text-sm font-light text-gray-500 dark:text-gray-300">
            Don’t have an account yet?
            <a
              class="font-medium text-sky-600 hover:underline dark:text-sky-500"
              routerLink="sign-up"
              >Sign up</a
            >
          </p>
        </form>
      </div>
    </div>
  </section> `,
  styles: [
    `
      .input {
        @apply bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500;
      }
    `,
  ],
})
export class SignInComponent {}
