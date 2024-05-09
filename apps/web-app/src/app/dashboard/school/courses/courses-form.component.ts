import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Course, Table, User } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';
import { ImageCropperComponent } from '@skooltrak/ui';
import { v4 } from 'uuid';

import { PictureComponent } from '../../../components/picture/picture.component';
import { SchoolCoursesStore } from './courses.store';

@Component({
  standalone: true,
  imports: [
    MatDialogModule,
    TranslateModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    PictureComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBar,
  ],
  template: ` <form [formGroup]="form" (ngSubmit)="saveChanges()">
    @if (store.loading()) {
      <mat-progress-bar mode="indeterminate" />
    }
    <h2 mat-dialog-title>
      {{ 'COURSES.DETAILS' | translate }}
    </h2>
    <mat-dialog-content class="grid grid-cols-2 gap-2 gap-y-1">
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
        <mat-label for="subject_id"
          >{{ 'COURSES.SUBJECT' | translate }}
        </mat-label>
        <mat-select formControlName="subject_id">
          @for (subject of store.subjects(); track subject.id) {
            <mat-option [value]="subject.id">{{ subject.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label for="weekly_hours"
          >{{ 'COURSES.WEEKLY_HOURS' | translate }}
        </mat-label>
        <input matInput formControlName="weekly_hours" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>{{ 'COURSES.TEACHERS' | translate }}</mat-label>
        <mat-select
          formControlName="teachers"
          multiple
          [compareWith]="compareFn"
        >
          @for (teacher of store.teacherUsers(); track teacher?.id) {
            <mat-option [value]="teacher"
              >{{ teacher?.first_name }} {{ teacher?.father_name }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field class="col-span-2">
        <mat-label for="description">{{ 'DESCRIPTION' | translate }}</mat-label>
        <textarea matInput formControlName="description"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-dialog-close mat-stroked-button>
        <mat-icon>close</mat-icon>
        {{ 'CONFIRMATION.CANCEL' | translate }}
      </button>
      <button mat-flat-button type="submit" [disabled]="form.invalid">
        {{ 'SAVE_CHANGES' | translate }}
      </button>
    </mat-dialog-actions>
  </form>`,
})
export class SchoolCoursesFormComponent implements OnInit {
  public store = inject(SchoolCoursesStore);
  public dialog = inject(MatDialog);
  public data: Course | undefined = inject(MAT_DIALOG_DATA);
  public pictureUrl = signal('default_picture.jpeg');
  public bucket = signal('courses');

  private supabase = inject(SupabaseService);

  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
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

  public ngOnInit(): void {
    if (this.data) {
      this.store.fetchTeachers();
      this.store.fetchPlans();
      this.store.fetchSubjects();
      this.form.patchValue(this.data);
      const { picture_url } = this.data;
      !!picture_url && this.pictureUrl.set(picture_url);
    }
  }

  public changePicture(): void {
    this.dialog
      .open(ImageCropperComponent, {
        width: '48rem',
        maxWidth: '90vw',
        data: { fixedRatio: true, ratio: 2, format: 'jpeg' },
      })
      .afterClosed()
      .subscribe({
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
    this.store.saveCourse(this.form.getRawValue());
  }

  public compareFn = (c1: User, c2: User): boolean =>
    c1 && c2 ? c1.id === c2.id : c1 === c2;
}
