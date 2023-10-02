import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgIf } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { School } from '@skooltrak/models';
import {
  ButtonDirective,
  CardComponent,
  ImageCropperComponent,
  SelectComponent,
} from '@skooltrak/ui';

import { AvatarComponent } from '../avatar/avatar.component';
import { SchoolFormStore } from './school-form.store';

@Component({
  standalone: true,
  selector: 'sk-school-form',
  imports: [
    ReactiveFormsModule,
    CardComponent,
    ButtonDirective,
    AvatarComponent,
    TranslateModule,
    SelectComponent,
    NgIf,
    NgIconComponent,
  ],
  providers: [
    provideComponentStore(SchoolFormStore),
    provideIcons({ heroXMark }),
  ],
  styles: [
    `
      input {
        @apply block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm;
        &.ng-invalid.ng-dirty {
          @apply border-red-400 bg-red-100 text-red-800 focus:border-red-600 focus:ring-red-600;
        }
      }

      label {
        @apply mb-2 block font-sans text-sm font-medium text-gray-500 dark:text-white;
      }
    `,
  ],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'School info' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <ng-icon
          name="heroXMark"
          size="24"
          class="text-gray-700 dark:text-gray-100"
        />
      </button>
    </div>
    <div class="flex flex-col items-center justify-center space-y-4">
      <sk-avatar
        *ngIf="school()?.crest_url"
        [avatarUrl]="school()?.crest_url!"
        (click)="uploadCrest()"
        bucket="crests"
        class="h-24 rounded-md"
      />
      <img
        *ngIf="!school()?.crest_url"
        (click)="uploadCrest()"
        src="assets/skooltrak-logo.svg"
        class="h-24"
        alt="Skooltrak Logo"
      />
    </div>
    <form
      [formGroup]="form"
      class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
      (ngSubmit)="saveChanges()"
    >
      <div>
        <label for="short_name">{{ 'Short name' | translate }}</label>
        <input type="text" formControlName="short_name" />
      </div>
      <div>
        <label for="full_name">{{ 'Full name' | translate }}</label>
        <input type="text" formControlName="full_name" />
      </div>
      <div>
        <label for="country_id">{{ 'Country' | translate }}</label>
        <sk-select
          formControlName="country_id"
          [items]="store.countries()"
          label="name"
        />
      </div>
      <div>
        <label for="address">{{ 'Address' | translate }}</label>
        <input type="text" formControlName="address" />
      </div>
      <div>
        <label for="motto" class="label font-sans">{{
          'Motto' | translate
        }}</label>
        <input type="text" formControlName="motto" />
      </div>
      <div>
        <label for="contact_email">{{ 'Contact email' | translate }}</label>
        <input type="email" formControlName="contact_email" />
      </div>
      <div>
        <label for="contact_phone">{{ 'Contact phone' | translate }}</label>
        <input type="tel" formControlName="contact_phone" />
      </div>
      <div class="col-span-4 flex justify-end">
        <button
          type="submit"
          skButton
          color="sky"
          [disabled]="this.form.invalid || this.form.untouched"
        >
          {{ 'Save changes' | translate }}
        </button>
      </div>
    </form>
  </sk-card> `,
})
export class SchoolFormComponent implements OnInit {
  public store = inject(SchoolFormStore);
  public school = this.store.school;
  private dialog = inject(Dialog);
  public dialogRef = inject(DialogRef);

  private data: School | undefined = inject(DIALOG_DATA);
  public form = new FormGroup({
    id: new FormControl<string>('', { nonNullable: true }),
    full_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    short_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20)],
    }),
    motto: new FormControl<string>('', { nonNullable: true }),
    address: new FormControl<string>('', { nonNullable: true }),
    contact_email: new FormControl<string>('', {
      validators: [Validators.email],
      nonNullable: true,
    }),
    contact_phone: new FormControl('', { nonNullable: true }),
    country_id: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  constructor() {
    effect(() => {
      if (this.store.school()) {
        this.form.patchValue(this.store.school()!);
      }
    });
  }

  ngOnInit(): void {
    !!this.data && this.store.patchState({ school: this.data });
  }

  uploadCrest() {
    const dialogRef = this.dialog.open<{
      imageFile: File | undefined;
      cropImgPreview: string;
    }>(ImageCropperComponent, { minWidth: '28rem' });
    dialogRef.closed.subscribe({
      next: (result) => {
        if (!result) return;
        const { imageFile } = result;
        !!imageFile && this.store.uploadCrest(imageFile);
      },
    });
  }

  saveChanges() {
    const { value } = this.form;
    const request = { ...value, ...this.store.school() };
    if (!request.id) {
      delete request.id;
    }
    this.store.saveSchool(request);
  }
}
