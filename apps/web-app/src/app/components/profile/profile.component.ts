import { DialogModule } from '@angular/cdk/dialog';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { webStore } from '@skooltrak/store';
import { ImageCropperComponent } from '@skooltrak/ui';

import { AvatarComponent } from '../avatar/avatar.component';
import { ProfileFormStore } from './profile.store';

@Component({
  selector: 'sk-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    AvatarComponent,
    DialogModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatInputModule,
    MatOption,
    MatButton,
    MatDatepickerModule,
  ],
  providers: [ProfileFormStore],
  template: `
    <div class="px-12">
      <h1 class="mat-headline-3">
        {{ 'PROFILE.TITLE' | translate }}
      </h1>

      <div class="mb-4  flex justify-center">
        @if (this.user()) {
          <sk-avatar
            [fileName]="this.user()?.avatar_url ?? 'default_avatar.jpg'"
            bucket="avatars"
            [rounded]="true"
            class="h-24 cursor-pointer"
            (click)="changeAvatar()"
          />
        }
      </div>
      <form [formGroup]="form" (ngSubmit)="saveChanges()">
        <div class="grid grid-cols-1 gap-2 lg:grid-cols-4">
          <mat-form-field>
            <mat-label for="first_name">{{
              'PROFILE.FIRST_NAME' | translate
            }}</mat-label>
            <input matInput type="text" formControlName="first_name" />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="middle_name">{{
              'PROFILE.MIDDLE_NAME' | translate
            }}</mat-label>
            <input matInput type="text" formControlName="middle_name" />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="father_name">{{
              'PROFILE.FATHER_NAME' | translate
            }}</mat-label>
            <input matInput type="text" formControlName="father_name" />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="mother_name">{{
              'PROFILE.MOTHER_NAME' | translate
            }}</mat-label>
            <input matInput type="text" formControlName="mother_name" />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="document_id">{{
              'PROFILE.DOCUMENT_ID' | translate
            }}</mat-label>
            <input matInput type="text" formControlName="document_id" />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="birth_date">{{
              'PROFILE.BIRTH_DATE' | translate
            }}</mat-label>
            <input
              formControlName="birth_date"
              matInput
              [matDatepicker]="birth_date"
            />
            <mat-datepicker-toggle matIconSuffix [for]="birth_date" />
            <mat-datepicker #birth_date />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="gender">{{
              'PROFILE.GENDER' | translate
            }}</mat-label>
            <mat-select formControlName="gender">
              @for (gender of store.genders(); track gender.id) {
                <mat-option [value]="gender.id">
                  {{ gender.name | translate }}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label for="email">{{ 'PROFILE.EMAIL' | translate }}</mat-label>
            <input matInput type="email" formControlName="email" />
          </mat-form-field>
          <div class="mt-2 md:col-span-4">
            <button
              type="submit"
              mat-flat-button
              [disabled]="this.form.invalid || this.form.pristine"
            >
              {{ 'SAVE_CHANGES' | translate }}
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private auth = inject(webStore.AuthStore);
  public store = inject(ProfileFormStore);
  public user = this.auth.user;
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  public currentAvatar = this.user()?.avatar_url;

  public form = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    avatar_url: new FormControl<string>('', { nonNullable: true }),
    first_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    middle_name: new FormControl<string>('', {
      nonNullable: true,
    }),
    father_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    mother_name: new FormControl<string>('', {
      nonNullable: true,
    }),
    document_id: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    birth_date: new FormControl<Date | undefined>(undefined, {
      nonNullable: true,
    }),
    gender: new FormControl<number | undefined>(undefined, {
      nonNullable: true,
    }),
  });

  public ngOnInit(): void {
    this.form.get('email')?.disable();
    !!this.user() && this.form.patchValue(this.user()!);
  }

  public changeAvatar(): void {
    this.dialog
      .open(ImageCropperComponent, {
        width: '24rem',
        maxWidth: '90vw',
        data: { fixedRatio: true, ratio: 1 },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (!result) return;
          const { imageFile } = result;

          if (imageFile) this.store.uploadAvatar(imageFile);
        },
      });
  }

  public saveChanges(): void {
    this.auth.updateProfile({
      ...this.form.getRawValue(),
      id: this.user()?.id,
    });
  }
}
