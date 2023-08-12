import { IconsModule } from '@amithvns/ng-heroicons';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { Assignment } from '@skooltrak/models';
import { addDays, format, setHours, setMinutes } from 'date-fns';
import { QuillModule } from 'ngx-quill';

import { ButtonDirective } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { SelectComponent } from '../select/select.component';
import { TabsItemComponent } from '../tabs-item/tabs-item.component';
import { TabsComponent } from '../tabs/tabs.component';
import { AssignmentFormStore } from './assignment-form.store';

@Component({
  selector: 'sk-assignment-form',
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    IconsModule,
    TabsComponent,
    TabsItemComponent,
    SelectComponent,
    QuillModule,
    ButtonDirective,
    ReactiveFormsModule,
  ],
  styles: [
    `
      input,
      select,
      quill-editor,
      textarea {
        @apply block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm;
        &.ng-invalid.ng-dirty {
          @apply border-red-400 bg-red-100 text-red-800 focus:border-red-600 focus:ring-red-600;
        }
      }
      label {
        @apply mb-2 block font-sans text-sm font-medium text-gray-600 dark:text-white;
      }
      quill-editor {
        @apply block p-0;
      }

      ::ng-deep .ql-container.ql-snow,
      ::ng-deep .ql-toolbar.ql-snow {
        @apply border-0;
      }
    `,
  ],
  providers: [provideComponentStore(AssignmentFormStore)],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'Assignments.Details' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <icon name="x-mark" class="text-gray-700 dark:text-gray-100" />
      </button>
    </div>
    <form [formGroup]="form" class="grid grid-cols-4 gap-4">
      <div class="col-span-2">
        <label for="title">{{ 'Title' | translate }}</label>
        <input type="text" name="title" formControlName="title" />
      </div>
      <div>
        <label for="course">{{ 'Courses' | translate }}</label>
        <sk-select
          [items]="store.courses()"
          label="subject.name"
          secondaryLabel="plan.name"
          formControlName="course_id"
        />
      </div>
      <div>
        <label for="type">{{ 'Type' | translate }}</label>
        <sk-select
          [items]="store.types()"
          label="name"
          formControlName="type_id"
        />
      </div>
      <div>
        <label for="start_date">{{ 'Start date' | translate }}</label>
        <input
          type="datetime-local"
          name="start_date"
          formControlName="start_date"
        />
      </div>

      <div class="col-span-4">
        <label for="description">{{ 'Description' | translate }}</label>
        <quill-editor
          formControlName="description"
          [modules]="modules"
          theme="snow"
          [styles]="{ height: '28vh' }"
        ></quill-editor>
      </div>
    </form>
    <div footer class="flex justify-end pt-6">
      <button skButton color="sky" type="submit">
        {{ 'Save changes' | translate }}
      </button>
    </div>
  </sk-card>`,
})
export class AssignmentFormComponent implements OnInit {
  public dialogRef = inject(DialogRef<Partial<Assignment>>);
  private data: Assignment | undefined = inject(DIALOG_DATA);
  private destroyRef = inject(DestroyRef);
  public store = inject(AssignmentFormStore);
  formateDate = (date: Date) =>
    format(setHours(setMinutes(addDays(date, 1), 0), 7), "yyyy-MM-dd'T'HH:mm");
  form = new FormGroup({
    title: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    course_id: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    type_id: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    start_date: new FormControl<string>(this.formateDate(new Date()), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    description: new FormControl<string>('', { nonNullable: true }),
  });

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
    ],
  };

  ngOnInit(): void {
    this.form
      .get('course_id')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (course_id) => this.store.patchState({ course_id }) });
  }
}
