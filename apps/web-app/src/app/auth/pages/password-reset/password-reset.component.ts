import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { webStore } from '@skooltrak/store';

@Component({
  selector: 'sk-password-reset',
  standalone: true,
  imports: [
    MatCardModule,
    TranslateModule,
    NgOptimizedImage,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  template: `<div class="flex flex-col items-center justify-center pt-24">
    <a href="#" class=" mb-6">
      <img
        width="240"
        height="40"
        loading="lazy"
        ngSrc="assets/images/skooltrak.svg"
        alt="logo"
      />
    </a>
    <mat-card class="w-full md:w-2/5 lg:w-3/5 xl:w-1/4 ">
      <mat-card-header>
        <mat-card-title>
          {{ 'RESET_PASSWORD.TITLE' | translate }}
        </mat-card-title>
        <mat-card-subtitle r>
          {{ 'RESET_PASSWORD.SUBTITLE' | translate }}
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field class="w-full">
          <mat-label for="email">{{ 'PROFILE.EMAIL' | translate }}</mat-label>
          <input
            type="email"
            name="email"
            placeholder="user@domain.com"
            [formControl]="emailControl"
            matInput
          />
        </mat-form-field>
      </mat-card-content>
      <mat-card-footer>
        <mat-card-actions align="end">
          <button
            class="w-full md:w-auto"
            mat-flat-button
            class="tertiary"
            type="submit"
            [disabled]="emailControl.invalid"
            (click)="requestPasswordRecovery()"
          >
            {{ 'RESET_PASSWORD.SEND_REQUEST' | translate }}
          </button>
        </mat-card-actions>
      </mat-card-footer>
    </mat-card>
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
