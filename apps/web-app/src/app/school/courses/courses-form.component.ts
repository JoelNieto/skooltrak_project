import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { Course } from '@skooltrak/models';
import {
  ButtonDirective,
  CardComponent,
  InputDirective,
  LabelDirective,
  SelectComponent,
} from '@skooltrak/ui';

import { UsersSelectorComponent } from '../../components/users-selector/users-selector.component';
import { CoursesFormStore } from './courses-form.store';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    NgIconComponent,
    ReactiveFormsModule,
    SelectComponent,
    ButtonDirective,
    UsersSelectorComponent,
    LabelDirective,
    InputDirective,
  ],
  providers: [
    provideComponentStore(CoursesFormStore),
    provideIcons({ heroXMark }),
  ],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'Course.Details' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <ng-icon
          name="heroXMark"
          size="24"
          class="text-gray-700 dark:text-gray-100"
        />
      </button>
    </div>
    <form
      [formGroup]="form"
      class="flex flex-col space-y-3"
      (ngSubmit)="saveChanges()"
    >
      <div>
        <label for="plan_id" skLabel>{{ 'Plan' | translate }}</label>
        <sk-select
          label="name"
          [items]="store.PLANS()"
          formControlName="plan_id"
        />
      </div>
      <div>
        <label for="subject_id" skLabel>{{
          'Subjects.Label' | translate
        }}</label>
        <sk-select
          label="name"
          [items]="store.SUBJECTS()"
          formControlName="subject_id"
        />
      </div>
      <div>
        <label for="weekly_hours" skLabel>{{
          'Weekly hours' | translate
        }}</label>
        <input skInput formControlName="weekly_hours" type="number" />
      </div>
      <div>
        <label for="description" skLabel>{{ 'Description' | translate }}</label>
        <textarea skInput formControlName="description"></textarea>
      </div>
      <div class="flex justify-end">
        <button skButton color="sky" type="submit" [disabled]="form.invalid">
          {{ 'Save changes' | translate }}
        </button>
      </div>
    </form>
  </sk-card>`,
})
export class SchoolCoursesFormComponent implements OnInit {
  public store = inject(CoursesFormStore);
  public dialogRef = inject(DialogRef);
  private data: Course | undefined = inject(DIALOG_DATA);

  public form = new FormGroup({
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
    description: new FormControl<string>('', { nonNullable: true }),
  });

  public ngOnInit(): void {
    !!this.data && this.form.patchValue(this.data);
  }

  public saveChanges(): void {
    this.dialogRef.close(this.form.getRawValue());
  }
}
