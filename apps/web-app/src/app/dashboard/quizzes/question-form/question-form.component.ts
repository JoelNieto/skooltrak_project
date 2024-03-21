import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { Question, QuestionOption, QuestionTypeEnum } from '@skooltrak/models';
import { CardComponent } from '@skooltrak/ui';
import { combineLatest, filter } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { QuizzesFormStore } from '../quizzes-form/quizzes-form.store';

@Component({
  selector: 'sk-question-form',
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatIconButton,
    MatMiniFabButton,
    MatIcon,
    MatListModule,
    MatSlideToggle,
    JsonPipe,
    ReactiveFormsModule,
  ],
  template: `<sk-card>
    <div header class="pb-4">
      <h3 class="text-lg font-title text-gray-600">
        {{ 'QUIZZES.QUESTION' | translate }} {{ index() + 1 }} /
        {{ store.questionsCount() }}
      </h3>
    </div>
    <form [formGroup]="form" class="">
      <div class="flex gap-8 w-full">
        <mat-form-field class="w-full">
          <mat-label>{{ 'QUIZZES.QUESTION_TEXT' | translate }}</mat-label>
          <input matInput type="text" formControlName="text" />
        </mat-form-field>
        <mat-form-field class="w-full">
          <mat-label>{{ 'QUIZZES.QUESTION_TYPE' | translate }}</mat-label>
          <mat-select formControlName="type">
            @for (type of types; track type) {
              <mat-option [value]="type">{{
                'QUESTION_TYPE.' + type | translate
              }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>
      @if (form.get('type')?.value === 'SELECTION') {
        <div formArrayName="options">
          <h3 class="font-title text-gray-400 text-sm mb-2">
            {{ 'QUIZZES.OPTIONS' | translate }}
          </h3>
          @for (option of options.controls; track option; let i = $index) {
            <div class="flex w-full gap-3" [formGroupName]="i">
              <mat-form-field class="w-full">
                <mat-label
                  >{{ 'QUIZZES.OPTION' | translate }} {{ i + 1 }}</mat-label
                >
                <input type="text" matInput formControlName="text" />
              </mat-form-field>
              <mat-slide-toggle
                class="w-full flex items-baseline mt-2"
                formControlName="is_correct"
              >
                {{ 'QUIZZES.IS_CORRECT' | translate }}
              </mat-slide-toggle>
              <div class="w-full flex items-baseline">
                <button mat-mini-fab color="warn" (click)="removeOptions(i)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          }
          <button mat-mini-fab color="accent" (click)="addOptions()">
            <mat-icon>playlist_add</mat-icon>
          </button>
        </div>
      }
    </form>
    <div footer class="flex justify-end">
      <button mat-icon-button (click)="store.removeQuestion(index())">
        <mat-icon class="text-red-600">delete</mat-icon>
      </button>
    </div>
  </sk-card>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionFormComponent implements OnInit {
  public question = input.required<Question>();
  public index = input.required<number>();
  public types = Object.values(QuestionTypeEnum);
  public store = inject(QuizzesFormStore);
  private destroy = inject(DestroyRef);

  public form = new FormGroup({
    id: new FormControl(uuidv4(), { nonNullable: true }),
    text: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    type: new FormControl<QuestionTypeEnum | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    options: new FormArray<FormGroup>([]),
  });

  public ngOnInit(): void {
    const { type, text, id, options } = this.question();
    this.form.patchValue({ type, text, id });

    if (options?.length) {
      this.existingOptions();
    }

    combineLatest([this.form.valueChanges, this.form.statusChanges])
      .pipe(
        takeUntilDestroyed(this.destroy),
        filter(([, status]) => status === 'VALID'),
      )
      .subscribe({
        next: ([value]) => {
          this.store.updateQuestion(this.index(), value);
        },
      });

    this.form.get('type')?.valueChanges.subscribe({
      next: (type) => {
        if (
          type === QuestionTypeEnum.SELECTION &&
          !this.form.controls.options.length
        ) {
          this.addOptions();
        }
      },
    });
  }

  get options(): FormArray {
    return this.form.get('options') as FormArray;
  }

  private existingOptions(): void {
    this.question().options?.forEach((option) => {
      this.addOptions(option);
    });
  }

  public addOptions(option?: Partial<QuestionOption>): void {
    const id = uuidv4();
    this.form.controls.options.push(
      new FormGroup({
        id: new FormControl(option?.id ?? id, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        text: new FormControl<string>(option?.text ?? '', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        is_correct: new FormControl<boolean>(option?.is_correct ?? false, {
          nonNullable: true,
        }),
      }),
    );
  }

  public removeOptions(index: number): void {
    const { id } = this.form.controls.options.at(index).getRawValue();

    !!id && this.store.removeOption(id);

    this.form.controls.options.removeAt(index);
  }
}
