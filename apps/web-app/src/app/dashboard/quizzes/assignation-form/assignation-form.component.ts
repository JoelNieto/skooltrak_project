import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { QuizAssignation } from '@skooltrak/models';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { QuizAssignationStore } from './assignation-form.store';

@Component({
  selector: 'sk-assignation-form',
  standalone: true,
  providers: [QuizAssignationStore],
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
    MatIcon,
    MatIconButton,
    MatDatepickerModule,
    MatInput,
    MatSlideToggle,
    MatButton,
  ],
  template: `<mat-card>
    <mat-card-header>
      <div class="flex items-center justify-between w-full">
        <mat-card-title>
          {{ 'QUIZZES.ASSIGNATION' | translate }}
        </mat-card-title>
        <button mat-icon-button (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </mat-card-header>
    <mat-card-content>
      <form
        [formGroup]="form"
        (ngSubmit)="saveAssignation()"
        class="grid lg:grid-cols-2 gap-4"
      >
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
        <div footer class="flex col-span-2 justify-end">
          <button
            mat-flat-button
            type="submit"
            [disabled]="form.invalid"
            color="accent"
          >
            {{ 'SAVE_CHANGES' | translate }}
          </button>
        </div>
      </form>
    </mat-card-content>
  </mat-card>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignationFormComponent implements OnInit {
  public dialogRef = inject(DialogRef);
  private data: {
    quizId: string | undefined;
    assignation: QuizAssignation | undefined;
  } = inject(DIALOG_DATA);
  public state = inject(QuizAssignationStore);
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
    const { quizId, assignation } = this.data;

    if (quizId) {
      this.form.patchValue({ quiz_id: quizId });
    }

    if (assignation) {
      this.form.patchValue(assignation);
    }
  }

  public saveAssignation(): void {
    this.state.saveAssignation(this.form.getRawValue());
  }
}
