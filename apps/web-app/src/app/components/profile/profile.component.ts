import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NgFor, NgIf } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { authState } from '@skooltrak/auth';
import {
  ButtonDirective,
  CardComponent,
  ImageCropperComponent,
} from '@skooltrak/ui';

import { AvatarComponent } from '../avatar/avatar.component';
import { ProfileFormStore } from './profile.store';

@Component({
  selector: 'sk-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    NgFor,
    NgIf,
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
          class=" font-title sticky top-0 flex pb-3 text-2xl font-bold leading-tight tracking-tight text-gray-700 dark:text-white"
        >
          {{ 'Profile' | translate }}
        </h2>
        <div class="mb-4  flex justify-center">
          <sk-avatar
            *ngIf="this.user()"
            [avatarUrl]="this.user()!.avatar_url!"
            bucket="avatars"
            [rounded]="true"
            class="h-24 cursor-pointer"
            (click)="changeAvatar()"
          />
        </div>

        <form [formGroup]="form" (ngSubmit)="saveChanges()">
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
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
                [disabled]="this.form.invalid || this.form.pristine"
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
        @apply block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm;
        &.ng-invalid.ng-dirty {
          @apply border-red-400 bg-red-100 text-red-800 focus:border-red-600 focus:ring-red-600;
        }
        &[disabled] {
          @apply cursor-not-allowed text-gray-400 dark:text-gray-500;
        }
      }

      label {
        @apply mb-2 block font-sans text-sm font-medium text-gray-600 dark:text-white;
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  private auth = inject(authState.AuthStateFacade);
  public store = inject(ProfileFormStore);
  user = this.auth.user;
  private dialog = inject(Dialog);
  currentAvatar = this.user()?.avatar_url;

  form = new FormGroup({
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
    this.auth.updateProfile({
      ...this.form.getRawValue(),
      id: this.user()?.id,
    });
  }
}
