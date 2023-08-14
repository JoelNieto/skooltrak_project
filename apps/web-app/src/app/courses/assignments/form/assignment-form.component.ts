import { IconsModule } from '@amithvns/ng-heroicons';
import { NgClass, NgFor } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { ClassGroup } from '@skooltrak/models';
import {
  ButtonDirective,
  CardComponent,
  SelectComponent,
  TabsComponent,
  TabsItemComponent,
  UtilService,
} from '@skooltrak/ui';
import { QuillModule } from 'ngx-quill';

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
    NgClass,
    NgFor,
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
  template: `
    <form class="flex gap-4" [formGroup]="assignmentForm">
      <sk-card class="flex-1">
        <div class="flex items-start justify-between" header>
          <h3
            class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
          >
            {{ 'Assignments.Details' | translate }}
          </h3>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="title">{{ 'Title' | translate }}</label>
            <input type="text" name="title" formControlName="title" />
          </div>
          <div>
            <label for="course">{{ 'Course.Title' | translate }}</label>
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
          <div class="col-span-2">
            <label for="description">{{ 'Description' | translate }}</label>
            <quill-editor
              formControlName="description"
              [modules]="modules"
              theme="snow"
              [styles]="{ height: '32vh' }"
            ></quill-editor>
          </div>
        </div>
        <div footer class="flex justify-end pt-6">
          <button skButton color="sky" type="submit">
            {{ 'Save changes' | translate }}
          </button>
        </div>
      </sk-card>
      <sk-card class="w-72 flex-none">
        <div header>
          <h2
            class="font-title mb-1 flex text-lg leading-tight tracking-tight text-gray-700 dark:text-white"
          >
            {{ 'Groups' | translate }}
          </h2>
          <div class="mt-4 flex flex-col gap-4">
            <div *ngFor="let group of store.groups()">
              <label [for]="group.id">{{ group.name }}</label>
              <input type="datetime-local" [name]="group.id" />
            </div>
          </div>
        </div>
      </sk-card>
    </form>
  `,
})
export class AssignmentFormComponent implements OnInit {
  @Input({ required: true }) course_id!: string;
  private destroyRef = inject(DestroyRef);
  private util = inject(UtilService);
  public store = inject(AssignmentFormStore);

  assignmentForm = new FormGroup({
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
    start_date: new FormControl<string>(this.util.formateDate(new Date()), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    description: new FormControl<string>('', { nonNullable: true }),
    groups: new FormArray<any>([]),
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

  constructor() {
    effect(() => {
      const groups = this.store.groups();
      !!groups && this.setGroups(groups);
    });
  }

  ngOnInit(): void {
    this.assignmentForm
      .get('course_id')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (course_id) => this.store.patchState({ course_id }) });
    !!this.course_id && this.setCourse();
  }

  setCourse() {
    this.assignmentForm.get('course_id')?.patchValue(this.course_id);
    this.assignmentForm.get('course_id')?.disable();
  }

  setGroups(groups: Partial<ClassGroup>[]) {
    const control = this.assignmentForm.controls.groups;
    groups.forEach((group) => {
      control.push(
        new FormGroup({
          group_id: new FormControl(group.id),
        })
      );
    });
  }
}
