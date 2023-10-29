import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { authState, SupabaseService } from '@skooltrak/auth';
import { ButtonDirective, CardComponent, InputDirective } from '@skooltrak/ui';

import { SignUpStore } from './sign-up.store';

@Component({
  selector: 'sk-sign-up',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgOptimizedImage,
    ButtonDirective,
    RouterOutlet,
    CardComponent,
    TranslateModule,
    ReactiveFormsModule,
    InputDirective,
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
      <sk-card class="w-full md:w-2/5 lg:w-3/5 xl:w-1/2">
        <h1 class="font-title text-2xl text-gray-700 dark:text-gray-100" header>
          {{ 'SIGN_UP.TITLE' | translate }}
        </h1>
        <h3 class="font-sans text-gray-500 dark:text-gray-300" header>
          {{ 'SIGN_UP.PROVIDE_INFO' | translate }}
        </h3>
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-3"
        >
          <div>
            <label for="first_name">{{
              'SIGN_UP.FIRST_NAME' | translate
            }}</label>
            <input
              type="text"
              name="first_name"
              placeholder="John"
              formControlName="first_name"
              skInput
            />
          </div>
          <div>
            <label for="first_name">{{
              'SIGN_UP.FATHER_NAME' | translate
            }}</label>
            <input
              skInput
              type="text"
              name="father_name"
              placeholder="Doe"
              formControlName="father_name"
            />
          </div>
          <div>
            <label for="email">{{ 'SIGN_UP.EMAIL' | translate }}</label>
            <input
              type="email"
              name="email"
              placeholder="user@domain.com"
              formControlName="email"
              skInput
            />
          </div>
          <div>
            <label for="password">{{ 'SIGN_UP.PASSWORD' | translate }}</label>
            <input
              type="password"
              name="password"
              autocomplete="new-password"
              formControlName="password"
              placeholder="•••••••••"
              skInput
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
              {{ 'SIGN_UP.CREATE_ACCOUNT' | translate }}
            </button>
          </div>
        </form>
        <p class="mt-4 text-sm font-light text-gray-500 dark:text-gray-300">
          {{ 'SIGN_UP.EXISTING_ACCOUNT' | translate }}
          <a
            class="font-medium text-sky-600 hover:underline dark:text-sky-500"
            routerLink="../sign-in"
            >{{ 'SIGN_UP.SIGN_IN' | translate }}</a
          >
        </p>
      </sk-card>
    </div>
  `,
  styles: [``],
})
export class SignUpComponent {
  supabase = inject(SupabaseService);
  store$ = inject(Store);
  auth = inject(authState.AuthStateFacade);
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

  onSubmit() {
    const { father_name, first_name, email, password } =
      this.form.getRawValue();
    this.auth.signUp({
      email,
      password,
      first_name,
      father_name,
    });
  }
}
