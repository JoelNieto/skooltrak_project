import { ChangeDetectionStrategy, Component, effect, inject, Injector, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { Question, QuestionTypeEnum } from '@skooltrak/models';
import { ButtonDirective, CardComponent } from '@skooltrak/ui';

import { QuestionFormComponent } from '../question-form/question-form.component';
import { QuizzesFormStore } from './quizzes-form.store';

@Component({
  selector: 'sk-quizzes-form',
  standalone: true,
  providers: [QuizzesFormStore],
  template: `<div class="flex justify-center">
    <div class="flex flex-col gap-5 w-full lg:w-3/5">
      <sk-card>
        <div header>
          <h1 class="text-2xl font-title text-gray-700">
            {{ 'QUIZZES.DETAILS' | translate }}
          </h1>
        </div>
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
      </sk-card>
      @for (
        question of state.questions();
        track question.id;
        let idx = $index
      ) {
        <sk-question-form [question]="question" [index]="idx" />
      }
      <div class="flex justify-end">
        <button skButton color="green" (click)="state.addQuestion()">
          {{ 'QUIZZES.ADD_QUESTION' | translate }}
        </button>
      </div>
    </div>
  </div> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    TranslateModule,
    QuestionFormComponent,
    ButtonDirective,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class QuizzesFormComponent implements OnInit {
  public quizId = input<string>();
  public state = inject(QuizzesFormStore);
  private injector = inject(Injector);
  public form = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>('', { nonNullable: true }),
  });

  public types = Object.values(QuestionTypeEnum);
  public questions: Question[] = [];

  public ngOnInit(): void {
    if (this.quizId()) {
      patchState(this.state, { quizId: this.quizId() });
      effect(
        () => {
          if (this.state.title()) {
            const { title, description } = this.state;
            this.form.patchValue({
              title: title(),
              description: description(),
            });
          }
        },
        { injector: this.injector },
      );

      return;
    }
    this.state.addQuestion();
  }
}
