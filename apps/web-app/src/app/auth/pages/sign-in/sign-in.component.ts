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
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { webStore } from '@skooltrak/store';

@Component({
  selector: 'sk-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    NgOptimizedImage,
    MatButton,
    RouterLink,
    MatCardModule,
    MatFormField,
    MatLabel,
    MatInput,
  ],
  template: `<div class="w-min-screen flex h-screen">
    <section class="w-full flex-none font-sans  md:w-1/2 lg:w-1/3">
      <div
        class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0"
      >
        <a
          href="#"
          class="font-title mb-6 flex items-center text-2xl text-gray-900 dark:text-white"
        >
          <img
            width="300"
            height="80"
            loading="lazy"
            ngSrc="assets/images/skooltrak.svg"
            alt="logo"
          />
        </a>
        <mat-card class="w-full">
          <mat-card-header>
            <mat-card-title
              class="font-title text-xl leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
            >
              {{ 'SIGN_IN.TITLE' | translate }}
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form class="space-y-2" [formGroup]="form" (ngSubmit)="signIn()">
              <mat-form-field class="w-full">
                <mat-label>
                  {{ 'SIGN_IN.EMAIL' | translate }}
                </mat-label>
                <input
                  formControlName="email"
                  type="email"
                  name="email"
                  id="email"
                  autocomplete="email"
                  placeholder="name@company.com"
                  required
                  matInput
                />
              </mat-form-field>
              <mat-form-field class="w-full">
                <mat-label>{{ 'SIGN_IN.PASSWORD' | translate }}</mat-label>
                <input
                  formControlName="password"
                  autocomplete="current-password"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  required=""
                  matInput
                />
              </mat-form-field>
              <div class="flex items-center justify-between">
                <a
                  routerLink="../password-reset"
                  class="text-sm font-medium text-sky-600 hover:underline dark:text-sky-500"
                  >{{ 'SIGN_IN.FORGOT_PASSWORD' | translate }}</a
                >
              </div>
              <button
                mat-flat-button
                color="primary"
                type="submit"
                [disabled]="form.invalid"
                class="w-full"
              >
                {{ 'SIGN_IN.ENTER' | translate }}
              </button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-300">
                {{ 'SIGN_IN.NOT_ACCOUNT' | translate }}
                <a
                  class="font-medium text-sky-600 hover:underline dark:text-sky-500"
                  routerLink="../sign-up"
                  >{{ 'SIGN_IN.SIGN_UP' | translate }}</a
                >
              </p>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </section>
    <div class="bg grow"></div>
  </div> `,
  styles: [
    `
      .bg {
        background-image: url('/assets/images/sign-in-bg.jpg');
        background-size: cover;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  private auth = inject(webStore.AuthStore);

  public form = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
  });

  public signIn(): void {
    const { email, password } = this.form.getRawValue();
    this.auth.signIn(email, password);
  }
}
