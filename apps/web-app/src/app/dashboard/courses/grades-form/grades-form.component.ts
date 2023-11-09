import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { Course, Grade } from '@skooltrak/models';
import { ButtonDirective, CardComponent, InputDirective, LabelDirective, SelectComponent } from '@skooltrak/ui';

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
  providers: [
    provideComponentStore(GradesFormStore),
    provideIcons({ heroXMark }),
  ],
  template: `<form [formGroup]="gradeForm" (ngSubmit)="saveGrade()">
    <sk-card>
      <div class="flex items-start justify-between" header>
        <h3
          class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
        >
          {{ 'Grades.Details' | translate }}
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
            <label for="title" skLabel>{{ 'Title' | translate }}</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              formControlName="title"
              skInput
            />
          </div>
          <div>
            <label for="bucket" skLabel>{{ 'Type' | translate }}</label>
            <sk-select
              [items]="BUCKETS()"
              label="name"
              placeholder="Select bucket"
              formControlName="bucket_id"
            />
          </div>
          <div>
            <label for="start_at" skLabel>{{ 'Date' | translate }}</label>
            <input
              type="date"
              name="start_at"
              formControlName="start_at"
              id="start_at"
              skInput
            />
          </div>
        </div>
        <h4 class="font-title mt-4">{{ 'Students' | translate }}</h4>
        <div class="mt-2 flex max-h-80 flex-col overflow-auto pb-4 pt-2">
          @for(student of students; track student) {
            <div
              class="flex items-center justify-between border-b border-gray-200 px-4 py-2"
            >
              Joel Nieto
              <div class="w-24">
                <input
                  type="number"
                  name="title"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>
          }
        </div>
      </div>
      <div footer class="flex justify-end pt-6">
        <button skButton color="blue" class="mr-2">
          {{ 'Publish' | translate }}
        </button>
        <button skButton color="green" type="submit">
          {{ 'Save changes' | translate }}
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
    course_id: new FormControl('', { nonNullable: true }),
    period_id: new FormControl('', { nonNullable: true }),
  });
  private store = inject(GradesFormStore);
  public dialogRef = inject(DialogRef<Grade>);
  public students = Array.from(Array(20).keys());
  private data: { course: Course; grade: Grade | undefined } =
    inject(DIALOG_DATA);
  public BUCKETS = this.store.BUCKETS;

  public ngOnInit(): void {
    const { course } = this.data;
    const { id: course_id, period_id } = course;
    this.store.patchState({ COURSE_ID: course?.id });
    this.gradeForm.patchValue({ course_id, period_id });
  }

  public saveGrade(): void {
    const { grade } = this.data;
    !grade && this.store.createGrade(this.gradeForm.getRawValue());
  }
}
