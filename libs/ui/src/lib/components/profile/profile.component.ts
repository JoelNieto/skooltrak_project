import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NgFor } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { state } from '@skooltrak/auth';

import { AvatarComponent } from '../avatar/avatar.component';
import { ButtonDirective } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';
import { ProfileFormStore } from './profile.store';

@Component({
  selector: 'sk-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    NgFor,
    TranslateModule,
    ButtonDirective,
    AvatarComponent,
    DialogModule,
  ],
  providers: [provideComponentStore(ProfileFormStore)],
  template: `
    <div class="px-12 pt-4">
      <sk-card>
        <h2
          header
          class=" sticky top-0 pb-3 leading-tight tracking-tight flex text-gray-700 dark:text-white text-2xl font-title font-bold"
        >
          {{ 'Profile' | translate }}
        </h2>
        <div class="flex  justify-center mb-4">
          <sk-avatar
            [avatarUrl]="this.user()!.avatar_url!"
            bucket="avatars"
            [rounded]="true"
            class="h-24 cursor-pointer"
            (click)="changeAvatar()"
          />
        </div>

        <form [formGroup]="form" (ngSubmit)="saveChanges()">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div>
              <label for="first_name">{{ 'First name' | translate }}</label>
              <input type="text" formControlName="first_name" />
            </div>
            <div>
              <label for="middle_name">{{ 'Middle name' | translate }}</label>
              <input type="text" formControlName="middle_name" />
            </div>
            <div>
              <label for="father_name">{{ 'Father name' | translate }}</label>
              <input type="text" formControlName="father_name" />
            </div>
            <div>
              <label for="mother_name">{{ 'Mother name' | translate }}</label>
              <input type="text" formControlName="mother_name" />
            </div>
            <div>
              <label for="document_id">{{ 'Document ID' | translate }}</label>
              <input type="text" formControlName="document_id" />
            </div>
            <div>
              <label for="birth_date">{{ 'Birth date' | translate }}</label>
              <input type="date" formControlName="birth_date" />
            </div>
            <div>
              <label for="gender">{{ 'Gender' | translate }}</label>
              <select formControlName="gender">
                <option
                  *ngFor="let gender of store.genders()"
                  [value]="gender.id"
                >
                  {{ gender.name | translate }}
                </option>
              </select>
            </div>
            <div>
              <label for="email">{{ 'Email' | translate }}</label>
              <input type="email" formControlName="email" />
            </div>
            <div class="mt-2 md:col-span-4">
              <button
                type="submit"
                skButton
                color="sky"
                [disabled]="this.form.invalid || this.form.untouched"
              >
                {{ 'Save changes' | translate }}
              </button>
            </div>
          </div>
        </form>
      </sk-card>
    </div>
  `,
  styles: [
    `
      input,
      select {
        @apply bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500;
        &.ng-invalid.ng-dirty {
          @apply text-red-800 border-red-400 bg-red-100 focus:ring-red-600 focus:border-red-600;
        }
        &[disabled] {
          @apply text-gray-400 cursor-not-allowed dark:text-gray-500;
        }
      }

      label {
        @apply block mb-2 text-sm font-sans text-gray-600 font-medium dark:text-white;
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  private state$ = inject(Store);
  public store = inject(ProfileFormStore);
  user = this.state$.selectSignal(state.selectors.selectUser);
  private dialog = inject(Dialog);
  currentAvatar = this.user()?.avatar_url;

  form = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    full_name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    avatar_url: new FormControl<string>('', { nonNullable: true }),
    first_name: new FormControl<string>('', {
      nonNullable: true,
    }),
    middle_name: new FormControl<string>('', {
      nonNullable: true,
    }),
    father_name: new FormControl<string>('', {
      nonNullable: true,
    }),
    mother_name: new FormControl<string>('', {
      nonNullable: true,
    }),
    document_id: new FormControl<string>('', {
      nonNullable: true,
    }),
    birth_date: new FormControl<Date | undefined>(undefined, {
      nonNullable: true,
    }),
    gender: new FormControl<number | undefined>(undefined, {
      nonNullable: true,
    }),
  });

  constructor() {
    effect(() => {
      const user = this.user();
      !!user && this.form.patchValue(user);
    });
  }
  ngOnInit(): void {
    this.form.get('email')?.disable();
  }

  changeAvatar() {
    const dialogRef = this.dialog.open<{
      imageFile: File | undefined;
      cropImgPreview: string;
    }>(ImageCropperComponent, {
      minWidth: '28rem',
      data: { fixedRatio: true, ratio: 4 / 4 },
    });
    dialogRef.closed.subscribe({
      next: (result) => {
        if (!result) return;
        const { imageFile } = result;
        if (imageFile) this.store.uploadAvatar(imageFile);
      },
    });
  }

  saveChanges() {
    this.state$.dispatch(
      state.AuthActions.updateProfile({
        request: { ...this.form.getRawValue(), id: this.user()?.id },
      })
    );
  }
}
