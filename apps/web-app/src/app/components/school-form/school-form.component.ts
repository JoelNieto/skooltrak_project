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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { School, SchoolTypeEnum } from '@skooltrak/models';
import { ImageCropperComponent } from '@skooltrak/ui';

import { AvatarComponent } from '../avatar/avatar.component';
import { SchoolFormStore } from './school-form.store';

@Component({
    selector: 'sk-school-form',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButton,
        AvatarComponent,
        TranslateModule,
        MatIcon,
        MatFormField,
        MatLabel,
        MatInput,
        MatSelect,
        MatOption,
    ],
    providers: [SchoolFormStore],
    template: ` <form [formGroup]="form" (ngSubmit)="saveChanges()">
    <h2 mat-dialog-title>
      {{ 'SCHOOL.INFO' | translate }}
    </h2>

    <mat-dialog-content>
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
      <div class="mt-8 lg:grid gap-2">
        <mat-form-field class="w-full">
          <mat-label>{{ 'SCHOOL.SHORT_NAME' | translate }} </mat-label>
          <input type="text" formControlName="short_name" matInput />
        </mat-form-field>
        <mat-form-field class="w-full">
          <mat-label>{{ 'SCHOOL.FULL_NAME' | translate }} </mat-label>
          <input type="text" formControlName="full_name" matInput />
        </mat-form-field>
        <mat-form-field class="w-full">
          <mat-label>{{ 'SCHOOL.TYPE' | translate }}</mat-label>
          <mat-select formControlName="type">
            @for (type of types(); track type) {
              <mat-option [value]="type">
                {{ 'SCHOOL_TYPE.' + type | translate }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field class="w-full">
          <mat-label>{{ 'SCHOOL.COUNTRY' | translate }} </mat-label>
          <mat-select formControlName="country_id">
            @for (country of store.countries(); track country.id) {
              <mat-option [value]="country.id">{{ country.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field class="w-full">
          <mat-label>{{ 'SCHOOL.ADDRESS' | translate }} </mat-label>
          <input type="text" formControlName="address" matInput />
        </mat-form-field>
        <mat-form-field class="w-full">
          <mat-label>{{ 'SCHOOL.EMAIL' | translate }} </mat-label>
          <input type="email" formControlName="contact_email" matInput />
        </mat-form-field>
        <mat-form-field class="w-full">
          <mat-label>{{ 'SCHOOL.PHONE' | translate }} </mat-label>
          <input type="tel" formControlName="contact_phone" matInput />
        </mat-form-field>
        <mat-form-field class="col-span-2">
          <mat-label>{{ 'SCHOOL.MOTTO' | translate }}</mat-label>
          <input type="text" formControlName="motto" matInput />
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close>
        <mat-icon>close</mat-icon>
        {{ 'CONFIRMATION.CANCEL' | translate }}
      </button>
      <button type="submit" mat-flat-button [disabled]="this.form.invalid">
        {{ 'SAVE_CHANGES' | translate }}
      </button>
    </mat-dialog-actions>
  </form>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolFormComponent implements OnInit {
  public store = inject(SchoolFormStore);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  private data: School | undefined = inject(MAT_DIALOG_DATA);
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
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      width: '48rem',
      maxWidth: '90%',
      data: { ratio: 2, format: 'png' },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
