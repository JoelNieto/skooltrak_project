import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { webStore } from '@skooltrak/store';

@Component({
    selector: 'sk-change-password',
    imports: [
        MatCardModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        TranslateModule,
    ],
    template: `<div class="flex flex-col items-center justify-center">
    <mat-card class="w-full md:w-2/5 lg:w-3/5 xl:w-1/3 ">
      <mat-card-header>
        <mat-card-title>
          {{ 'CHANGE_PASSWORD.TITLE' | translate }}
        </mat-card-title>
        <mat-card-subtitle>
          {{ 'CHANGE_PASSWORD.SUBTITLE' | translate }}
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="form" class="flex flex-col gap-2">
          <mat-form-field>
            <mat-label for="new_password">{{
              'CHANGE_PASSWORD.NEW_PASSWORD' | translate
            }}</mat-label>
            <input
              formControlName="newPassword"
              type="password"
              name="new_password"
              placeholder="*******"
              matInput
            />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="confirm_password">{{
              'CHANGE_PASSWORD.CONFIRM_PASSWORD' | translate
            }}</mat-label>
            <input
              formControlName="confirmPassword"
              type="password"
              name="confirm_password"
              placeholder="*******"
              matInput
            />
          </mat-form-field>
        </form>
      </mat-card-content>
      <mat-card-footer>
        <mat-card-actions>
          <button
            class="w-full md:w-auto"
            mat-flat-button
            [disabled]="form.invalid"
            type="submit"
            (click)="changePassword()"
          >
            {{ 'CHANGE_PASSWORD.SET_PASSWORD' | translate }}
          </button>
        </mat-card-actions>
      </mat-card-footer>
    </mat-card>
  </div>`,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
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
