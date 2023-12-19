import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { Course, Grade } from '@skooltrak/models';
import {
  ButtonDirective,
  CardComponent,
  InputDirective,
  LabelDirective,
  SelectComponent,
} from '@skooltrak/ui';

import { GradesFormStore } from './grades-form.store';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    ButtonDirective,
    SelectComponent,
    ReactiveFormsModule,
    NgIconComponent,
    LabelDirective,
    InputDirective,
  ],
  providers: [GradesFormStore, provideIcons({ heroXMark })],
  template: `<form [formGroup]="gradeForm" (ngSubmit)="saveGrade()">
    <sk-card>
      <div class="flex items-start justify-between" header>
        <h3
          class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
        >
          {{ 'GRADES.DETAILS' | translate }}
        </h3>
        <button (click)="dialogRef.close()">
          <ng-icon
            name="heroXMark"
            size="24"
            class="text-gray-700 dark:text-gray-100"
          />
        </button>
      </div>
      <div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label for="title" skLabel>{{ 'GRADES.NAME' | translate }}</label>
            <input
              type="text"
              name="title"
              [placeholder]="'GRADES.NAME_PLACEHOLDER' | translate"
              formControlName="title"
              skInput
            />
          </div>
          <div>
            <label for="bucket" skLabel>{{ 'GRADES.TYPE' | translate }}</label>
            <sk-select
              [items]="this.store.buckets()"
              label="name"
              [placeholder]="'GRADES.SELECT_TYPE' | translate"
              formControlName="bucket_id"
            />
          </div>
          <div>
            <label for="start_at" skLabel>{{
              'GRADES.DATE' | translate
            }}</label>
            <input
              type="date"
              name="start_at"
              formControlName="start_at"
              id="start_at"
              skInput
            />
          </div>
          <div class="col-span-3">
            <label for="description" skLabel>{{
              'GRADES.DESCRIPTION' | translate
            }}</label>
            <textarea
              skInput
              formControlName="description"
              [placeholder]="'GRADES.DESCRIPTION_PLACEHOLDER' | translate"
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>
      <div footer class="flex justify-end pt-6">
        <button skButton color="blue" class="mr-2">
          {{ 'GRADES.PUBLISH' | translate }}
        </button>
        <button skButton color="green" type="submit">
          {{ 'GRADES.SAVE_CHANGES' | translate }}
        </button>
      </div>
    </sk-card>
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
    period_id: new FormControl('', { nonNullable: true }),
  });
  public store = inject(GradesFormStore);
  public dialogRef = inject(DialogRef<Grade>);
  public students = Array.from(Array(20).keys());
  private data: { course: Course; grade: Grade } = inject(DIALOG_DATA);

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
