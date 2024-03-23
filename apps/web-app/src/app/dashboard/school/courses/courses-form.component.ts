import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Course, Table, User } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';
import {
  CardComponent,
  ImageCropperComponent,
  SelectComponent,
} from '@skooltrak/ui';

import { PictureComponent } from '../../../components/picture/picture.component';
import { UsersSelectorComponent } from '../../../components/users-selector/users-selector.component';
import { CoursesFormStore } from './courses-form.store';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    ReactiveFormsModule,
    SelectComponent,
    UsersSelectorComponent,
    NgOptimizedImage,
    PictureComponent,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatIconButton,
    MatIcon,
    MatButton,
  ],
  providers: [CoursesFormStore],
  template: `<sk-card>
    <div class="flex items-center justify-between" header>
      <h3
        class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'COURSES.DETAILS' | translate }}
      </h3>
      <button (click)="dialogRef.close()" mat-icon-button>
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <form
      [formGroup]="form"
      class="grid grid-cols-2 gap-2 gap-y-1"
      (ngSubmit)="saveChanges()"
    >
      @if (data?.id) {
        <div class="col-span-2 rounded cursor-pointer hover:opacity-70 mb-4">
          <sk-picture
            [bucket]="bucket()"
            class="rounded w-64"
            [pictureURL]="pictureUrl()"
            (click)="changePicture()"
          />
        </div>
      }
      <mat-form-field>
        <mat-label for="plan_id">{{ 'COURSES.PLAN' | translate }}</mat-label>
        <mat-select formControlName="plan_id">
          @for (plan of store.plans(); track plan.id) {
            <mat-option [value]="plan.id">{{ plan.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label for="subject_id">{{
          'COURSES.SUBJECT' | translate
        }}</mat-label>
        <mat-select formControlName="subject_id">
          @for (subject of store.subjects(); track subject.id) {
            <mat-option [value]="subject.id">{{ subject.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label for="weekly_hours">{{
          'COURSES.WEEKLY_HOURS' | translate
        }}</mat-label>
        <input matInput formControlName="weekly_hours" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>{{ 'COURSES.TEACHERS' | translate }}</mat-label>
        <mat-select [formControl]="teachersControl" multiple>
          @for (teacher of store.teachers(); track teacher.user_id) {
            <mat-option [value]="teacher.user_id"
              >{{ teacher.user?.first_name }}
              {{ teacher.user?.father_name }}</mat-option
            >
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field class="col-span-2">
        <mat-label for="description">{{ 'DESCRIPTION' | translate }}</mat-label>
        <textarea matInput formControlName="description"></textarea>
      </mat-form-field>
      <div class="flex justify-end col-span-2">
        <button
          mat-flat-button
          color="accent"
          type="submit"
          [disabled]="form.invalid"
        >
          {{ 'SAVE_CHANGES' | translate }}
        </button>
      </div>
    </form>
  </sk-card>`,
})
export class SchoolCoursesFormComponent implements OnInit {
  public store = inject(CoursesFormStore);
  public dialog = inject(Dialog);
  public dialogRef = inject(DialogRef);
  public data: Course | undefined = inject(DIALOG_DATA);
  public pictureUrl = signal('default_picture.jpeg');
  public bucket = signal('courses');

  private supabase = inject(SupabaseService);

  public form = new FormGroup({
    plan_id: new FormControl<string | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    subject_id: new FormControl<string | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    weekly_hours: new FormControl<number>(0, {
      nonNullable: true,
    }),
    teachers: new FormControl<Partial<User>[]>([], { nonNullable: true }),
    description: new FormControl<string>('', { nonNullable: true }),
  });

  public teachersControl = new FormControl<string[]>([], {
    nonNullable: true,
  });

  public ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
      this.teachersControl.patchValue(this.data.teachers?.map((x) => x.id!));
      const { picture_url } = this.data;
      !!picture_url && this.pictureUrl.set(picture_url);
    }
  }

  public changePicture(): void {
    this.dialog
      .open<{ imageFile: File | undefined; cropImgPreview: string }>(
        ImageCropperComponent,
        {
          width: '48rem',
          maxWidth: '90%',
          data: { fixedRatio: true, ratio: 2, format: 'jpeg' },
        },
      )
      .closed.subscribe({
        next: async (res) => {
          if (!res) return;
          const { cropImgPreview, imageFile } = res;
          this.pictureUrl.set(cropImgPreview);

          if (!imageFile) {
            return;
          }
          const { data, error: uploadError } =
            await this.supabase.uploadPicture(imageFile, 'courses');

          if (uploadError) {
            console.error('upload', uploadError);

            return;
          }
          this.pictureUrl.set(data.path);

          if (data.path) {
            const { error } = await this.supabase.client
              .from(Table.Courses)
              .update({ picture_url: data.path })
              .eq('id', this.data?.id);

            if (error) {
              console.error(error);

              return;
            }
          }
        },
      });
  }

  public saveChanges(): void {
    this.dialogRef.close(
      {
        course: this.form.getRawValue(),
        teachers: this.teachersControl.getRawValue(),
      },
      {},
    );
  }
}
