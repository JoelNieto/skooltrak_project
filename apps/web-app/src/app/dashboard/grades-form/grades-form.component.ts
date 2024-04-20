import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Course, Grade } from '@skooltrak/models';

import { GradesFormStore } from './grades-form.store';

@Component({
  standalone: true,
  imports: [
    MatDialogModule,
    TranslateModule,
    MatButtonModule,
    MatIcon,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  providers: [GradesFormStore],
  template: `<form [formGroup]="gradeForm" (ngSubmit)="saveGrade()">
    <h2 mat-dialog-title>
      {{ 'GRADES.DETAILS' | translate }}
    </h2>

    <mat-dialog-content>
      <div class="grid grid-cols-2 gap-2">
        <mat-form-field>
          <mat-label for="title">{{ 'GRADES.NAME' | translate }}</mat-label>
          <input
            type="text"
            name="title"
            [placeholder]="'GRADES.NAME_PLACEHOLDER' | translate"
            formControlName="title"
            matInput
          />
        </mat-form-field>
        <mat-form-field>
          <mat-label for="bucket" skLabel>{{
            'GRADES.TYPE' | translate
          }}</mat-label>
          <mat-select
            [placeholder]="'GRADES.SELECT_TYPE' | translate"
            formControlName="bucket_id"
          >
            @for (bucket of store.buckets(); track bucket.id) {
              <mat-option [value]="bucket.id">{{ bucket.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label for="period">{{ 'GRADES.PERIOD' | translate }}</mat-label>
          <mat-select
            [placeholder]="'GRADES.SELECT_PERIOD' | translate"
            formControlName="period_id"
          >
            @for (period of store.periods(); track period.id) {
              <mat-option [value]="period.id">{{ period.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label for="start_at">{{ 'GRADES.DATE' | translate }}</mat-label>
          <input
            name="start_at"
            formControlName="start_at"
            id="start_at"
            matInput
            [matDatepicker]="picker"
          />
          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-datepicker #picker />
        </mat-form-field>
        <mat-form-field class="col-span-2">
          <mat-label for="description" skLabel>{{
            'GRADES.DESCRIPTION' | translate
          }}</mat-label>
          <textarea
            matInput
            formControlName="description"
            [placeholder]="'GRADES.DESCRIPTION_PLACEHOLDER' | translate"
            rows="3"
          ></textarea>
        </mat-form-field>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close>
        <mat-icon>close</mat-icon>
        {{ 'CONFIRMATION.CANCEL' | translate }}
      </button>
      <button mat-flat-button type="submit" [disabled]="gradeForm.invalid">
        {{ 'GRADES.SAVE_CHANGES' | translate }}
      </button>
    </mat-dialog-actions>
  </form>`,
})
export class GradesFormComponent implements OnInit {
  public gradeForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    bucket_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    start_at: new FormControl<Date | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    description: new FormControl('', { nonNullable: true }),
    course_id: new FormControl('', { nonNullable: true }),
    period_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  public store = inject(GradesFormStore);

  public students = Array.from(Array(20).keys());
  private data: { course: Course; grade: Grade } = inject(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    const { course, grade } = this.data;
    const { id: course_id, period_id } = course;
    !!course_id && this.store.fetchBuckets(course_id);

    grade
      ? this.gradeForm.patchValue(grade)
      : this.gradeForm.patchValue({ course_id, period_id });
  }

  public saveGrade(): void {
    const { grade } = this.data;
    let request = this.gradeForm.getRawValue();
    request = grade ? { ...request, ...grade } : request;
    !grade && this.store.saveGrade(request);
  }
}
