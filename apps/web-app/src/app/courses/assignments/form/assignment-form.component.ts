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
  UntypedFormArray,
  Validators,
} from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { ClassGroup } from '@skooltrak/models';
import {
  ButtonDirective,
  CardComponent,
  LabelDirective,
  SelectComponent,
  TabsComponent,
  TabsItemComponent,
} from '@skooltrak/ui';
import { QuillModule } from 'ngx-quill';
import { asapScheduler } from 'rxjs';

import { CoursesStore } from '../../courses.store';
import { AssignmentFormStore } from './assignment-form.store';

@Component({
  selector: 'sk-assignment-form',
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    TabsComponent,
    TabsItemComponent,
    SelectComponent,
    QuillModule,
    ButtonDirective,
    ReactiveFormsModule,
    NgClass,
    NgFor,
    NgIconComponent,
    LabelDirective,
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
    <form
      class="flex gap-4"
      [formGroup]="assignmentForm"
      (ngSubmit)="saveAssignment()"
    >
      <sk-card class="flex-1">
        <div class="flex items-start justify-between" header>
          <h3
            class="font-title mb-4 text-2xl  text-gray-700 dark:text-gray-100"
          >
            {{ (id ? 'ASSIGNMENTS.EDIT' : 'ASSIGNMENTS.NEW') | translate }}
          </h3>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="title" skLabel>{{ 'NAME' | translate }}</label>
            <input type="text" name="title" formControlName="title" />
          </div>
          <div>
            <label for="course" skLabel>{{
              'COURSES.TITLE' | translate
            }}</label>
            <sk-select
              [items]="store.COURSES()"
              label="subject.name"
              secondaryLabel="plan.name"
              formControlName="course_id"
            />
          </div>
          <div>
            <label for="type" skLabel>{{ 'TYPE' | translate }}</label>
            <sk-select
              [items]="store.TYPES()"
              label="name"
              formControlName="type_id"
            />
          </div>
          <div class="col-span-2">
            <label for="description" skLabel>{{
              'DESCRIPTION' | translate
            }}</label>
            <quill-editor
              formControlName="description"
              [modules]="modules"
              theme="snow"
              [styles]="{ height: '32vh' }"
            ></quill-editor>
          </div>
        </div>
        <div footer class="flex justify-end pt-6">
          <button
            skButton
            color="sky"
            type="submit"
            [disabled]="assignmentForm.invalid"
          >
            {{ 'SAVE_CHANGES' | translate }}
          </button>
        </div>
      </sk-card>
      <sk-card class="w-72 flex-none">
        <div header>
          <h2
            class="font-title mb-1 flex text-lg leading-tight tracking-tight text-gray-700 dark:text-white"
          >
            {{ 'GROUPS.TITLE' | translate }}
          </h2>
        </div>
        {{ store.ASSIGNMENT()?.title }}
        <div formArrayName="groups" class="mt-4 flex flex-col gap-4">
          <ng-container
            *ngFor="let group of formGroups.controls; let i = index"
          >
            <div [formGroupName]="i">
              <label [for]="i">{{ groups()[i].name }}</label>
              <input type="datetime-local" formControlName="start_at" />
            </div>
          </ng-container>
        </div>
      </sk-card>
    </form>
  `,
})
export class AssignmentFormComponent implements OnInit {
  @Input({ required: true }) public course_id!: string;
  @Input({ required: false }) public id?: string;
  private destroyRef = inject(DestroyRef);
  public store = inject(AssignmentFormStore);
  private state = inject(CoursesStore);
  public groups = this.state.groups;

  public assignmentForm = new FormGroup({
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
    description: new FormControl<string>('', { nonNullable: true }),
    groups: new UntypedFormArray([]),
  });

  public modules = {
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
      const groups = this.state.groups();
      !!groups && this.setGroups(groups);
    });
    effect(() => {
      const assignment = this.store.ASSIGNMENT();
      if (assignment) {
        this.assignmentForm.patchValue(assignment);
      }
    });
  }

  public ngOnInit(): void {
    this.assignmentForm
      .get('course_id')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (COURSE_ID) =>
          asapScheduler.schedule(() => this.store.patchState({ COURSE_ID })),
      });

    this.assignmentForm
      .get('groups')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) =>
          asapScheduler.schedule(() => this.store.patchState({ DATES: value })),
      });
    !!this.course_id && this.setCourse();
    !!this.id &&
      asapScheduler.schedule(() =>
        this.store.patchState({ SELECTED_ID: this.id })
      );
  }

  get formGroups(): FormArray {
    return this.assignmentForm.get('groups') as FormArray;
  }

  private setCourse(): void {
    this.assignmentForm.get('course_id')?.patchValue(this.course_id);
    this.assignmentForm.get('course_id')?.disable();
  }

  private setGroups(groups: Partial<ClassGroup>[]): void {
    const control = this.assignmentForm.controls.groups;
    groups.forEach((group) => {
      control.push(
        new FormGroup({
          group_id: new FormControl(group.id),
          start_at: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
          }),
        })
      );
    });
  }

  public saveAssignment(): void {
    const value = this.assignmentForm.getRawValue();
    this.store.saveAssignment(value);
  }
}
