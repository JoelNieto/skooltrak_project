import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { Question, QuestionTypeEnum } from '@skooltrak/models';
import { combineLatest, filter } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { QuestionFormComponent } from '../question-form/question-form.component';
import { QuizzesFormStore } from './quizzes-form.store';

@Component({
    selector: 'sk-quizzes-form',
    providers: [QuizzesFormStore],
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        TranslateModule,
        QuestionFormComponent,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
    ],
    template: `
    <div class="flex justify-center">
      <div class="flex flex-col gap-5 w-full lg:w-3/5">
        <h1 class="mat-headline-large">
          {{ 'QUIZZES.DETAILS' | translate }}
        </h1>

        <form [formGroup]="form" class="flex flex-col">
          <mat-form-field>
            <mat-label>{{ 'QUIZZES.NAME' | translate }}</mat-label>
            <input matInput formControlName="title" type="text" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>{{ 'QUIZZES.DESCRIPTION' | translate }}</mat-label>
            <textarea
              matInput
              formControlName="description"
              type="text"
            ></textarea>
          </mat-form-field>
        </form>

        @for (
          question of state.questions();
          track question.id;
          let idx = $index
        ) {
          <sk-question-form [question]="question" [index]="idx" />
        }
        <div class="flex justify-end">
          <button mat-flat-button color="accent" (click)="state.addQuestion()">
            {{ 'QUIZZES.ADD_QUESTION' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizzesFormComponent implements OnInit {
  public quizId = input<string>();
  public state = inject(QuizzesFormStore);
  private destroy = inject(DestroyRef);

  public form = new FormGroup({
    id: new FormControl(uuidv4(), { nonNullable: true }),
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
    }),
  });

  public types = Object.values(QuestionTypeEnum);
  public questions: Question[] = [];

  public ngOnInit(): void {
    combineLatest([this.form.valueChanges, this.form.statusChanges])
      .pipe(
        takeUntilDestroyed(this.destroy),
        filter(([, status]) => status === 'VALID'),
      )
      .subscribe({
        next: ([value]) => {
          const { title, description, id } = value;
          patchState(this.state, {
            title,
            description,
            quizId: id,
            isUpdated: true,
          });
        },
      });
    const id = this.quizId();

    if (id) {
      this.getQuiz(id);
    }
  }

  private async getQuiz(id: string): Promise<void> {
    const data = await this.state.getQuiz(id);

    this.form.patchValue(
      {
        id: this.quizId(),
        title: data?.title,
        description: data?.description,
      },
      { emitEvent: false },
    );
  }
}
