import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  InputDirective,
  LabelDirective,
} from '@skooltrak/ui';

import { AvatarComponent } from '../avatar/avatar.component';
import { ProfileFormStore } from './profile.store';

@Component({
  selector: 'sk-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    ButtonDirective,
    AvatarComponent,
    DialogModule,
    LabelDirective,
    InputDirective,
  ],
  providers: [provideComponentStore(ProfileFormStore)],
  template: `
    <div class="px-12 pt-4">
      <sk-card>
        <h2
          header
          class=" font-title sticky top-0 flex pb-3 text-2xl font-bold leading-tight tracking-tight text-gray-700 dark:text-white"
        >
          {{ 'PROFILE.TITLE' | translate }}
        </h2>
        <div class="mb-4  flex justify-center">
          @if (this.USER()) {
            <sk-avatar
              [avatarUrl]="this.USER()?.avatar_url ?? 'default_avatar.jpg'"
              bucket="avatars"
              [rounded]="true"
              class="h-24 cursor-pointer"
              (click)="changeAvatar()"
            />
          }
        </div>
        <form [formGroup]="form" (ngSubmit)="saveChanges()">
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div>
              <label skLabel for="first_name">{{
                'PROFILE.FIRST_NAME' | translate
              }}</label>
              <input skInput type="text" formControlName="first_name" />
            </div>
            <div>
              <label skLabel for="middle_name">{{
                'PROFILE.MIDDLE_NAME' | translate
              }}</label>
              <input skInput type="text" formControlName="middle_name" />
            </div>
            <div>
              <label skLabel for="father_name">{{
                'PROFILE.FATHER_NAME' | translate
              }}</label>
              <input skInput type="text" formControlName="father_name" />
            </div>
            <div>
              <label skLabel for="mother_name">{{
                'PROFILE.MOTHER_NAME' | translate
              }}</label>
              <input skInput type="text" formControlName="mother_name" />
            </div>
            <div>
              <label skLabel for="document_id">{{
                'PROFILE.DOCUMENT_ID' | translate
              }}</label>
              <input skInput type="text" formControlName="document_id" />
            </div>
            <div>
              <label skLabel for="birth_date">{{
                'PROFILE.BIRTH_DATE' | translate
              }}</label>
              <input skInput type="date" formControlName="birth_date" />
            </div>
            <div>
              <label skLabel for="gender">{{
                'PROFILE.GENDER' | translate
              }}</label>
              <select skInput formControlName="gender">
                @for (gender of store.GENDERS(); track gender.id) {
                  <option [value]="gender.id">
                    {{ gender.name | translate }}
                  </option>
                }
              </select>
            </div>
            <div>
              <label skLabel for="email">{{
                'PROFILE.EMAIL' | translate
              }}</label>
              <input skInput type="email" formControlName="email" />
            </div>
            <div class="mt-2 md:col-span-4">
              <button
                type="submit"
                skButton
                color="sky"
                [disabled]="this.form.invalid || this.form.pristine"
              >
                {{ 'SAVE_CHANGES' | translate }}
              </button>
            </div>
          </div>
        </form>
      </sk-card>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private auth = inject(authState.AuthStateFacade);
  public store = inject(ProfileFormStore);
  public USER = this.auth.USER;
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);
  public currentAvatar = this.USER()?.avatar_url;

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
    this.auth.current_user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => !!user && this.form.patchValue(user),
      });
  }

  public changeAvatar(): void {
    this.dialog
      .open<{
        imageFile: File | undefined;
        cropImgPreview: string;
      }>(ImageCropperComponent, {
        minWidth: '28rem',
        data: { fixedRatio: true, ratio: 4 / 4 },
      })
      .closed.pipe(takeUntilDestroyed(this.destroyRef))
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
      id: this.USER()?.id,
    });
  }
}
