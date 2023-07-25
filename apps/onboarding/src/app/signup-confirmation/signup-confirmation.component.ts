import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective, CardComponent } from '@skooltrak/ui';

@Component({
  standalone: true,
  imports: [CardComponent, NgOptimizedImage, ButtonDirective, RouterLink],
  template: `
    <div
      class="flex min-h-screen w-screen flex-col items-center justify-center bg-gray-100 px-8 dark:bg-gray-700"
    >
      <sk-card class="w-full md:w-3/5 xl:w-1/3">
        <div header>
          <a
            href="#"
            class="font-title mb-3 flex items-center justify-center text-center text-xl text-gray-900 dark:text-gray-100"
          >
            <img
              class="h-12"
              width="40"
              height="40"
              loading="lazy"
              ngSrc="assets/skooltrak-logo.svg"
              alt="logo"
            />
          </a>
          <h1
            class="font-title text-center text-3xl text-gray-700 dark:text-gray-100"
          >
            Successfully signed up!
          </h1>
        </div>

        <h4 class="my-4 font-sans text-xl text-gray-400 dark:text-gray-500">
          You had been signed up in Skooltrak and your user was created
        </h4>
        <p class="my-4 font-sans text-gray-800 dark:text-gray-200">
          You must have been sent a confirmation email with a link to complete
          the registration. After that, you're in!
        </p>
        <p class="text-sm font-light text-gray-500 dark:text-gray-300">
          Don’t have an account yet?
          <a
            class="font-medium text-sky-600 hover:underline dark:text-sky-500"
            routerLink="../sign-up"
            >Sign up</a
          >
        </p>
        <div footer class="flex justify-center">
          <a skButton color="sky" routerLink="/">Go back to login</a>
        </div>
      </sk-card>
    </div>
  `,
})
export class SignUpConfirmationComponent {}
