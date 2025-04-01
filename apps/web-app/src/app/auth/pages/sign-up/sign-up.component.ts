import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { webStore } from '@skooltrak/store';

@Component({
    selector: 'sk-sign-up',
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        TranslateModule,
        NgOptimizedImage,
        MatButton,
        MatInput,
        MatFormField,
        MatLabel,
        RouterLink,
    ],
    template: `<div
    class="flex min-h-screen w-screen flex-col items-center justify-center px-8 dark:bg-gray-700"
  >
    <a
      href="#"
      class=" mb-6 flex items-center text-2xl text-gray-900 dark:text-gray-100"
    >
      <img
        width="240"
        height="60"
        loading="lazy"
        ngSrc="assets/images/skooltrak.svg"
        alt="logo"
      />
    </a>
    <mat-card class="w-full md:w-2/5 lg:w-3/5 xl:w-1/2">
      <mat-card-header>
        <mat-card-title
          class="font-title text-2xl text-gray-700 dark:text-gray-100"
        >
          {{ 'SIGN_UP.TITLE' | translate }}
        </mat-card-title>
        <mat-card-subtitle class="font-sans text-gray-500 dark:text-gray-300">
          {{ 'SIGN_UP.PROVIDE_INFO' | translate }}
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-3"
        >
          <mat-form-field>
            <mat-label for="first_name">{{
              'SIGN_UP.FIRST_NAME' | translate
            }}</mat-label>
            <input
              type="text"
              name="first_name"
              placeholder="John"
              formControlName="first_name"
              matInput
            />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="first_name">{{
              'SIGN_UP.FATHER_NAME' | translate
            }}</mat-label>
            <input
              matInput
              type="text"
              name="father_name"
              placeholder="Doe"
              formControlName="father_name"
            />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="email">{{ 'SIGN_UP.EMAIL' | translate }}</mat-label>
            <input
              type="email"
              name="email"
              placeholder="user@domain.com"
              formControlName="email"
              matInput
            />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="password">{{
              'SIGN_UP.PASSWORD' | translate
            }}</mat-label>
            <input
              type="password"
              name="password"
              autocomplete="new-password"
              formControlName="password"
              placeholder="•••••••••"
              matInput
            />
          </mat-form-field>

          <div class="md:col-span-2">
            <button
              class="w-full md:w-auto"
              mat-flat-button
              type="submit"
              [disabled]="form.invalid"
            >
              {{ 'SIGN_UP.CREATE_ACCOUNT' | translate }}
            </button>
          </div>
        </form>
      </mat-card-content>

      <mat-card-footer
        class="mt-4 text-sm font-light text-gray-500 dark:text-gray-300"
      >
        {{ 'SIGN_UP.EXISTING_ACCOUNT' | translate }}
        <a
          class="font-medium text-sky-600 hover:underline dark:text-sky-500"
          routerLink="../sign-in"
          >{{ 'SIGN_UP.SIGN_IN' | translate }}</a
        >
      </mat-card-footer>
    </mat-card>
  </div> `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent {
  private auth = inject(webStore.AuthStore);
  public form = new FormGroup({
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

  public onSubmit(): void {
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
