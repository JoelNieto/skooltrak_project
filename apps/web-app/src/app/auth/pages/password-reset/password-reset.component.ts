import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { webStore } from '@skooltrak/store';
import {
  ButtonDirective,
  CardComponent,
  InputDirective,
  LabelDirective,
} from '@skooltrak/ui';

@Component({
  selector: 'sk-password-reset',
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    NgOptimizedImage,
    InputDirective,
    LabelDirective,
    ReactiveFormsModule,
    ButtonDirective,
  ],
  template: `<div
    class="flex min-h-screen w-screen flex-col items-center justify-center bg-gray-100 px-8 dark:bg-gray-700"
  >
    <a
      href="#"
      class=" mb-6 flex items-center text-2xl text-gray-900 dark:text-gray-100"
    >
      <img
        width="240"
        height="40"
        loading="lazy"
        ngSrc="assets/images/skooltrak.svg"
        alt="logo"
      />
    </a>
    <sk-card class="w-full md:w-2/5 lg:w-3/5 xl:w-1/3 ">
      <h1 class="font-title text-2xl text-gray-700 dark:text-gray-100" header>
        {{ 'RESET_PASSWORD.TITLE' | translate }}
      </h1>
      <h3 class="font-sans text-gray-400 dark:text-gray-100" header>
        {{ 'RESET_PASSWORD.SUBTITLE' | translate }}
      </h3>
      <div>
        <label for="email" skLabel>{{ 'PROFILE.EMAIL' | translate }}</label>
        <input
          type="email"
          name="email"
          placeholder="user@domain.com"
          [formControl]="emailControl"
          skInput
        />
      </div>
      <div class="flex justify-end pt-2" footer>
        <button
          class="w-full md:w-auto"
          skButton
          color="green"
          type="submit"
          [disabled]="emailControl.invalid"
          (click)="requestPasswordRecovery()"
        >
          {{ 'RESET_PASSWORD.SEND_REQUEST' | translate }}
        </button>
      </div>
    </sk-card>
  </div>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetComponent {
  public emailControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  private readonly auth = inject(webStore.AuthStore);

  public requestPasswordRecovery(): void {
    this.auth.resetPassword(this.emailControl.value);
  }
}
