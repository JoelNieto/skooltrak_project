import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { authState } from '@skooltrak/auth';
import {
  ButtonDirective,
  CardComponent,
  InputDirective,
  LabelDirective,
} from '@skooltrak/ui';

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
    CardComponent,
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
        <sk-card class="w-full">
          <div header>
            <h1
              class="font-title text-xl leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
            >
              {{ 'SIGN_IN.TITLE' | translate }}
            </h1>
          </div>
          <div>
            <form
              class="space-y-4 md:space-y-6"
              [formGroup]="form"
              (ngSubmit)="signIn()"
            >
              <div>
                <label for="email" class="label" skLabel>{{
                  'SIGN_IN.EMAIL' | translate
                }}</label>
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
                <label class="label" skLabel>{{
                  'SIGN_IN.PASSWORD' | translate
                }}</label>
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
                <a
                  routerLink="../password-reset"
                  class="text-sm font-medium text-sky-600 hover:underline dark:text-sky-500"
                  >{{ 'SIGN_IN.FORGOT_PASSWORD' | translate }}</a
                >
              </div>
              <button
                skButton
                color="sky"
                type="submit"
                [disabled]="form.invalid"
                class="w-full "
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
          </div>
        </sk-card>
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
