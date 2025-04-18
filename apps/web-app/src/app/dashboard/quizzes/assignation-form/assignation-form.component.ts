import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { QuizAssignation } from '@skooltrak/models';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { QuizAssignationsStore } from '../quiz-assignations/quiz-assignations.store';

@Component({
    selector: 'sk-assignation-form',
    imports: [
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        TranslateModule,
        MatIcon,
        MatDatepickerModule,
        MatInput,
        MatSlideToggle,
        MatButtonModule,
        MatProgressBar,
    ],
    template: `<form [formGroup]="form" (ngSubmit)="saveAssignation()">
    @if (state.loading()) {
      <mat-progress-bar mode="indeterminate" />
    }
    <h2 mat-dialog-title>
      {{ 'QUIZZES.ASSIGNATION' | translate }}
    </h2>
    <mat-dialog-content>
      <div class="grid lg:grid-cols-2 gap-4">
        <mat-form-field>
          <mat-label>{{ 'QUIZZES.COURSE' | translate }}</mat-label>
          <mat-select formControlName="course_id">
            @for (course of state.courses(); track course.id) {
              <mat-option [value]="course.id"
                >{{ course.subject?.name }} - {{ course.plan.name }}</mat-option
              >
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>{{ 'QUIZZES.ITEM' | translate }}</mat-label>
          <mat-select formControlName="quiz_id">
            @for (quiz of state.quizzes(); track quiz.id) {
              <mat-option [value]="quiz.id">{{ quiz.title }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>{{ 'QUIZZES.START_DATE' | translate }}</mat-label>
          <input
            matInput
            formControlName="start_date"
            [matDatepicker]="start"
          />
          <mat-datepicker-toggle matIconSuffix [for]="start" />
          <mat-datepicker #start />
        </mat-form-field>
        <mat-form-field>
          <mat-label>{{ 'QUIZZES.END_DATE' | translate }}</mat-label>
          <input matInput formControlName="end_date" [matDatepicker]="end" />
          <mat-datepicker-toggle matIconSuffix [for]="end" />
          <mat-datepicker #end />
        </mat-form-field>
        <mat-form-field>
          <mat-label>
            {{ 'QUIZZES.TIME' | translate }}
          </mat-label>
          <input type="number" formControlName="minutes" matInput />
        </mat-form-field>
        <div class="flex items-baseline pb-3">
          <mat-slide-toggle formControlName="hidden">{{
            'HIDDEN' | translate
          }}</mat-slide-toggle>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close>
        <mat-icon>close</mat-icon>
        {{ 'CONFIRMATION.CANCEL' | translate }}
      </button>
      <button mat-flat-button type="submit" [disabled]="form.invalid">
        {{ 'SAVE_CHANGES' | translate }}
      </button>
    </mat-dialog-actions>
  </form> `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignationFormComponent implements OnInit {
  private data: QuizAssignation | undefined = inject(MAT_DIALOG_DATA);
  public state = inject(QuizAssignationsStore);
  public form = new FormGroup({
    id: new FormControl(uuidv4(), { nonNullable: true }),
    course_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    quiz_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    start_date: new FormControl(format(new Date(), 'yyyy-MM-dd'), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    end_date: new FormControl(format(new Date(), 'yyyy-MM-dd'), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    minutes: new FormControl<number | undefined>(undefined, {
      nonNullable: true,
    }),
    hidden: new FormControl(false, { nonNullable: true }),
  });

  public ngOnInit(): void {
    this.state.getCourses();
    this.state.getQuizzes();

    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  public saveAssignation(): void {
    this.state.saveAssignation(this.form.getRawValue());
  }
}
