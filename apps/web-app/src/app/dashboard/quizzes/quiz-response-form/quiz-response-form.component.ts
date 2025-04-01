import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { QuestionTypeEnum } from '@skooltrak/models';

import { QuizResponseStore } from './quiz-response.store';

@Component({
  selector: 'sk-quiz-response-form',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    TranslateModule,
  ],
  providers: [QuizResponseStore],
  template: `<div class="flex justify-center">
    <div class="flex flex-col gap-5 w-full lg:w-3/5">
      <div class="pb-6">
        <h2
          class="text-3xl text-gray-700 font-semibold font-title leading-tight"
        >
          {{ state.quiz()?.title }}
        </h2>
        <p class="text-lg font-light text-gray-500">
          {{ state.quiz()?.description }}
        </p>
      </div>
      @for (
        question of state.quiz()?.questions;
        track question.id;
        let idx = $index;
        let count = $count
      ) {
        <mat-card>
          <mat-card-header>
            <mat-card-title class="text-gray-400 text-sm">
              {{ 'QUIZZES.QUESTION' | translate }} {{ idx + 1 }} / {{ count }}
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h3 class="text-lg font-semibold text-gray-700 mb-4">
              {{ question.text }}
            </h3>
            @switch (question.type) {
              @case (questionType.SHORT_TEXT) {
                <mat-form-field class="w-full">
                  <mat-label>{{ 'QUIZZES.ANSWER_TEXT' | translate }}</mat-label>
                  <input
                    type="text"
                    [placeholder]="'QUIZZES.ANSWER_PLACEHOLDER' | translate"
                    matInput
                  />
                </mat-form-field>
              }
              @case (questionType.LONG_TEXT) {
                <mat-form-field class="w-full">
                  <mat-label>{{ 'QUIZZES.ANSWER_TEXT' | translate }}</mat-label>
                  <textarea
                    type="text"
                    [placeholder]="'QUIZZES.ANSWER_PLACEHOLDER' | translate"
                    rows="5"
                    matInput
                  ></textarea>
                </mat-form-field>
              }
              @case (questionType.SELECTION) {
                <label id="example-radio-group-label">{{
                  'QUIZZES.ANSWER_SELECTION' | translate
                }}</label>
                <mat-radio-group class="flex flex-col">
                  @for (option of question.options; track option.id) {
                    <mat-radio-button [value]="option.id">{{
                      option.text
                    }}</mat-radio-button>
                  }
                </mat-radio-group>
              }
              @case (questionType.BOOLEAN) {
                <label id="example-radio-group-label">{{
                  'QUIZZES.ANSWER_SELECTION' | translate
                }}</label>
                <mat-radio-group class="flex flex-col">
                  <mat-radio-button [value]="true">{{
                    'TRUE' | translate
                  }}</mat-radio-button>
                  <mat-radio-button [value]="false">{{
                    'FALSE' | translate
                  }}</mat-radio-button>
                </mat-radio-group>
              }
            }
          </mat-card-content>
        </mat-card>
      }
    </div>
  </div> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizResponseFormComponent implements OnInit {
  public quizId = input.required<string>();
  public state = inject(QuizResponseStore);
  public questionType = QuestionTypeEnum;

  public ngOnInit(): void {
    this.state.getQuiz(this.quizId());
  }
}
