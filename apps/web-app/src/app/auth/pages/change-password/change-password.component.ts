import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { webStore } from '@skooltrak/store';
import {
  ButtonDirective,
  CardComponent,
  InputDirective,
  LabelDirective,
} from '@skooltrak/ui';

@Component({
  selector: 'sk-change-password',
  standalone: true,
  imports: [
    CardComponent,
    ReactiveFormsModule,
    ButtonDirective,
    InputDirective,
    LabelDirective,
    TranslateModule,
  ],
  template: `<div
    class="flex min-h-screen w-screen flex-col items-center justify-center bg-gray-100 px-8 dark:bg-gray-700"
  >
    <sk-card class="w-full md:w-2/5 lg:w-3/5 xl:w-1/3 ">
      <h1 class="font-title text-2xl text-gray-700 dark:text-gray-100" header>
        {{ 'CHANGE_PASSWORD.TITLE' | translate }}
      </h1>
      <h3 class="font-sans text-gray-400 dark:text-gray-100" header>
        {{ 'CHANGE_PASSWORD.SUBTITLE' | translate }}
      </h3>
      <form [formGroup]="form" class="flex flex-col gap-2 mb-3">
        <div>
          <label for="new_password" skLabel>{{
            'CHANGE_PASSWORD.NEW_PASSWORD' | translate
          }}</label>
          <input
            formControlName="newPassword"
            type="password"
            name="new_password"
            placeholder="*******"
            skInput
          />
        </div>
        <div>
          <label for="confirm_password" skLabel>{{
            'CHANGE_PASSWORD.CONFIRM_PASSWORD' | translate
          }}</label>
          <input
            formControlName="confirmPassword"
            type="password"
            name="confirm_password"
            placeholder="*******"
            skInput
          />
        </div>
      </form>

      <div class="flex justify-end pt-2" footer>
        <button
          class="w-full md:w-auto"
          skButton
          color="green"
          [disabled]="form.invalid"
          type="submit"
          (click)="changePassword()"
        >
          {{ 'CHANGE_PASSWORD.SET_PASSWORD' | translate }}
        </button>
      </div>
    </sk-card>
  </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent {
  public form = new FormGroup({
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  private readonly auth = inject(webStore.AuthStore);

  public changePassword(): void {
    const { newPassword } = this.form.getRawValue();
    this.auth.changePassword(newPassword);
  }
}
