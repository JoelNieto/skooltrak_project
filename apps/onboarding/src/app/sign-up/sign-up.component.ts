import { IconsModule } from '@amithvns/ng-heroicons';
import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent, CardComponent } from '@skooltrak/ui';

import { SignUpStore } from './sign-up.store';

@Component({
  selector: 'sk-sign-up',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgOptimizedImage,
    ButtonComponent,
    IconsModule,
    RouterOutlet,
    CardComponent,
    TranslateModule,
  ],
  providers: [provideComponentStore(SignUpStore)],
  template: `
    <section class="bg-gray-50  dark:bg-gray-800">
      <div class="flex items-center p-4 ml-8">
        <div class="basis-1/3 flex flex-col gap-6">
          <div
            class="border border-emerald-500 p-4 rounded-lg bg-emerald-100 text-emerald-800 flex justify-between items-center"
          >
            Choose school
            <icon name="check-circle" class="h-8" />
          </div>
          <div
            class="border border-sky-500 p-4 rounded-lg bg-sky-100 text-sky-800 flex justify-between items-center"
          >
            Personal data
            <icon name="arrow-small-right" class="h-8" />
          </div>
          <div
            class="border border-gray-500 p-4 rounded-lg bg-gray-100 text-gray-800"
          >
            Confirmation
          </div>
        </div>
        <div class="basis-2/3">
          <div
            class="flex items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
          >
            <skooltrak-card>
              <a
                header
                href="#"
                class="flex items-center text-2xl font-mono mb-6 text-gray-900 dark:text-white"
              >
                <img
                  class="w-8 h-8 mr-2"
                  width="40"
                  height="40"
                  loading="lazy"
                  ngSrc="assets/skooltrak-logo.svg"
                  alt="logo"
                />
                <span
                  class="self-center text-gray-700 text-xl font-semibold font-title sm:text-2xl whitespace-nowrap dark:text-white"
                  >{{ 'App title' | translate }}</span
                >
              </a>
              <router-outlet />
            </skooltrak-card>
          </div>
        </div>
      </div>
    </section>
  `,
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
export class SignUpComponent {}
