import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { authState } from '@skooltrak/auth';
import { ButtonDirective, InputDirective, LabelDirective } from '@skooltrak/ui';

@Component({
  selector: 'sk-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    NgOptimizedImage,
    LabelDirective,
    InputDirective,
    ButtonDirective,
    RouterLink,
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
            class="h-12"
            width="240"
            height="40"
            loading="lazy"
            ngSrc="assets/images/skooltrak.svg"
            alt="logo"
          />
        </a>
        <div
          class="w-full space-y-4 rounded-lg bg-white p-6 dark:border dark:border-gray-700 dark:bg-gray-600 sm:max-w-md sm:p-8 md:mt-0 md:space-y-6"
        >
          <h1
            class="font-title text-xl leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
          >
            {{ 'SIGN_IN.TITLE' | translate }}
          </h1>
          <form
            class="space-y-4 md:space-y-6"
            [formGroup]="form"
            (ngSubmit)="signIn()"
          >
            <div>
              <label for="email" class="label" skLabel>Your email</label>
              <input
                formControlName="email"
                type="email"
                name="email"
                id="email"
                class="input"
                autocomplete="email"
                placeholder="name@company.com"
                required
                skInput
              />
            </div>
            <div>
              <label class="label" skLabel>Password</label>
              <input
                formControlName="password"
                autocomplete="current-password"
                class="input"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                required=""
                skInput
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
        background-image: url('/assets/images/sign-in-bg.jpg');
        background-size: cover;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  private auth = inject(authState.AuthStateFacade);

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
