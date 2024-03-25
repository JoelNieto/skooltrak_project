import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { School, SchoolTypeEnum } from '@skooltrak/models';
import { ImageCropperComponent, SelectComponent } from '@skooltrak/ui';

import { AvatarComponent } from '../avatar/avatar.component';
import { SchoolFormStore } from './school-form.store';

@Component({
  standalone: true,
  selector: 'sk-school-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButton,
    AvatarComponent,
    TranslateModule,
    SelectComponent,
    NgIconComponent,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
  ],
  providers: [SchoolFormStore, provideIcons({ heroXMark })],
  template: `<mat-card>
    <mat-card-header class="flex items-start justify-between">
      <mat-card-title class="font-title ">
        {{ 'SCHOOL.INFO' | translate }}
      </mat-card-title>
      <button (click)="dialogRef.close()">
        <ng-icon
          name="heroXMark"
          size="24"
          class="text-gray-700 dark:text-gray-100"
        />
      </button>
    </mat-card-header>
    <mat-card-content>
      @if (store.school()?.id) {
        <div class="flex flex-col items-center justify-center space-y-4">
          @if (store.school()?.crest_url) {
            <sk-avatar
              [fileName]="store.school()?.crest_url!"
              (click)="uploadCrest()"
              bucket="crests"
              class="h-24 rounded-md"
            />
          } @else {
            <img
              (click)="uploadCrest()"
              src="assets/images/skooltrak-logo.svg"
              class="h-24"
              alt="Skooltrak Logo"
            />
          }
        </div>
      }

      <form
        [formGroup]="form"
        class="mt-8 lg:grid gap-2 "
        (ngSubmit)="saveChanges()"
      >
        <mat-form-field class="w-full">
          <mat-label for="short_name">{{
            'SCHOOL.SHORT_NAME' | translate
          }}</mat-label>
          <input type="text" formControlName="short_name" matInput />
        </mat-form-field>
        <mat-form-field class="w-full">
          <mat-label for="full_name">{{
            'SCHOOL.FULL_NAME' | translate
          }}</mat-label>
          <input type="text" formControlName="full_name" matInput />
        </mat-form-field>
        <mat-form-field class="w-full">
          <mat-label for="type">{{ 'SCHOOL.TYPE' | translate }}</mat-label>
          <mat-select formControlName="type" matInput>
            @for (type of types(); track type) {
              <mat-option [value]="type">
                {{ 'SCHOOL_TYPE.' + type | translate }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field class="w-full">
          <mat-label for="country_id">{{
            'SCHOOL.COUNTRY' | translate
          }}</mat-label>
          <mat-select formControlName="country_id">
            @for (country of store.countries(); track country.id) {
              <mat-option [value]="country.id">{{ country.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field class="w-full">
          <mat-label for="address">{{
            'SCHOOL.ADDRESS' | translate
          }}</mat-label>
          <input type="text" formControlName="address" matInput />
        </mat-form-field>
        <mat-form-field class="w-full">
          <mat-label for="contact_email">{{
            'SCHOOL.EMAIL' | translate
          }}</mat-label>
          <input type="email" formControlName="contact_email" matInput />
        </mat-form-field>
        <mat-form-field class="w-full">
          <mat-label for="contact_phone">{{
            'SCHOOL.PHONE' | translate
          }}</mat-label>
          <input type="tel" formControlName="contact_phone" matInput />
        </mat-form-field>
        <mat-form-field class="col-span-2">
          <mat-label for="motto">{{ 'SCHOOL.MOTTO' | translate }}</mat-label>
          <input type="text" formControlName="motto" matInput />
        </mat-form-field>
        <div class="col-span-4 flex justify-end">
          <button
            type="submit"
            mat-flat-button
            color="primary"
            [disabled]="this.form.invalid"
          >
            {{ 'SAVE_CHANGES' | translate }}
          </button>
        </div>
      </form>
    </mat-card-content>
  </mat-card> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolFormComponent implements OnInit {
  public store = inject(SchoolFormStore);
  private dialog = inject(Dialog);
  public dialogRef = inject(DialogRef);
  private destroyRef = inject(DestroyRef);

  private data: School | undefined = inject(DIALOG_DATA);
  public types = signal(Object.values(SchoolTypeEnum));

  public form = new FormGroup({
    id: new FormControl<string>('', { nonNullable: true }),
    full_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    short_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    motto: new FormControl<string>('', { nonNullable: true }),
    address: new FormControl<string>('', { nonNullable: true }),
    contact_email: new FormControl<string>('', {
      validators: [Validators.email],
      nonNullable: true,
    }),
    type: new FormControl<SchoolTypeEnum | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    contact_phone: new FormControl('', { nonNullable: true }),
    country_id: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  constructor() {
    effect(() => {
      const school = this.store.school();
      !!school && this.form.patchValue(school);
    });
  }

  public ngOnInit(): void {
    !!this.data && patchState(this.store, { school: this.data });
  }

  public uploadCrest(): void {
    const dialogRef = this.dialog.open<{
      imageFile: File | undefined;
      cropImgPreview: string;
    }>(ImageCropperComponent, {
      width: '48rem',
      maxWidth: '90%',
      data: { ratio: 2, format: 'png' },
    });
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        if (!result) return;
        const { imageFile } = result;
        !!imageFile && this.store.uploadCrest(imageFile);
      },
    });
  }

  public saveChanges(): void {
    const { value } = this.form;
    const request = { ...this.store.school(), ...value };

    if (!request.id) {
      delete request.id;
    }
    delete request.country;
    this.store.saveSchool(request);
  }
}
