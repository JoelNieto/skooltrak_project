import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';
import { ButtonComponent, ImageCropperComponent } from '@skooltrak/ui';
import { AvatarComponent } from 'libs/ui/src/lib/avatar/avatar.component';

import { SchoolStore } from './schools.store';

@Component({
  selector: 'skooltrak-school',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgFor,
    NgIf,
    AvatarComponent,
    FormsModule,
    ButtonComponent,
    DialogModule,
  ],
  providers: [provideComponentStore(SchoolStore)],
  template: `<h2
      class=" sticky top-0 bg-white dark:bg-gray-800 pb-3 leading-tight tracking-tight flex text-gray-700 dark:text-white text-2xl font-mono font-bold mb-2"
    >
      School settings
    </h2>
    <div class="flex flex-col items-center justify-center space-y-4">
      <skooltrak-avatar
        *ngIf="school()?.crest_url"
        [avatarUrl]="school()?.crest_url!"
        (click)="uploadCrest()"
        bucket="crests"
        class="rounded-md h-36"
      />
    </div>
    <form
      [formGroup]="form"
      class="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4 mt-2"
      (ngSubmit)="saveChanges()"
    >
      <div>
        <label for="short_name" class="label"> Short name </label>
        <input type="text" class="input" formControlName="short_name" />
      </div>
      <div>
        <label for="full_name" class="label"> Full name </label>
        <input type="text" class="input" formControlName="full_name" />
      </div>
      <div>
        <label for="country" class="label"> Country </label>
        <select class="input" formControlName="country_id">
          <option *ngFor="let country of countries()" [value]="country.id">
            {{ country.name }}
          </option>
        </select>
      </div>
      <div>
        <label for="address" class="label">Address</label>
        <input type="text" class="input" formControlName="address" />
      </div>
      <div>
        <label for="motto" class="label">Motto</label>
        <input type="text" class="input" formControlName="motto" />
      </div>
      <div>
        <label for="contact_email" class="label">Contact email</label>
        <input type="email" class="input" formControlName="contact_email" />
      </div>
      <div class="col-span-4 flex justify-end">
        <button type="submit" skooltrak-button color="blue">
          Save changes
        </button>
      </div>
    </form> `,
  styles: [
    `
      .input {
        @apply bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500;
        &.ng-invalid.ng-dirty {
          @apply text-red-800 border-red-400 bg-red-100 focus:ring-red-600 focus:border-red-600;
        }
      }

      .label {
        @apply block mb-2 text-sm font-sans text-gray-600 font-medium dark:text-white;
      }
    `,
  ],
})
export class SchoolComponent {
  form = new FormGroup({
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
    crest_url: new FormControl<string>('', { nonNullable: true }),
    contact_email: new FormControl<string>('', {
      validators: [Validators.email],
      nonNullable: true,
    }),
    country_id: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  dialog = inject(Dialog);
  store = inject(SchoolStore);
  currentCrest = 'assets/school-crest.png';
  school = this.store.school;
  countries = this.store.countries;
  private cdRef = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      this.school()! && this.form.patchValue(this.school()!);
    });
  }

  uploadCrest() {
    const dialogRef = this.dialog.open<{
      imageFile: File | undefined;
      cropImgPreview: string;
    }>(ImageCropperComponent, { minWidth: '28rem' });
    dialogRef.closed.subscribe({
      next: (result) => {
        if (!result) return;
        const { imageFile, cropImgPreview } = result;
        this.currentCrest = cropImgPreview;
        this.store.uploadCrest(imageFile!);
        this.cdRef.detectChanges();
      },
    });
  }

  saveChanges() {
    const value = this.form.getRawValue();
    this.store.updateSchool(value);
  }
}
