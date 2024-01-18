import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
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
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { ClassGroup } from '@skooltrak/models';
import {
  ButtonDirective,
  CardComponent,
  InputDirective,
  LabelDirective,
  SelectComponent,
  TabsComponent,
  TabsItemComponent,
} from '@skooltrak/ui';
import { QuillModule } from 'ngx-quill';
import { asapScheduler } from 'rxjs';

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
    NgIconComponent,
    LabelDirective,
    InputDirective,
  ],
  styles: [
    `
      quill-editor {
        @apply block p-0;
      }

      ::ng-deep .ql-container.ql-snow,
      ::ng-deep .ql-toolbar.ql-snow {
        @apply border-0;
      }
    `,
  ],
  providers: [AssignmentFormStore],
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
            {{ (id() ? 'ASSIGNMENTS.EDIT' : 'ASSIGNMENTS.NEW') | translate }}
          </h3>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="title" skLabel>{{ 'NAME' | translate }}</label>
            <input skInput type="text" name="title" formControlName="title" />
          </div>
          <div>
            <label for="course" skLabel>{{
              'COURSES.TITLE' | translate
            }}</label>
            <sk-select
              [items]="store.courses()"
              label="subject.name"
              secondaryLabel="plan.name"
              formControlName="course_id"
            />
          </div>
          <div>
            <label for="type" skLabel>{{ 'TYPE' | translate }}</label>
            <sk-select
              [items]="store.types()"
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
              skInput
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
        {{ store.assignment()?.title }}
        <div formArrayName="groups" class="mt-4 flex flex-col gap-4">
          @for (group of formGroups.controls; track group; let i = $index) {
            <ng-container>
              <div [formGroupName]="i">
                <label [for]="i">{{ store.groups()[i].name }}</label>
                <input skInput type="date" formControlName="date" />
              </div>
            </ng-container>
          }
        </div>
      </sk-card>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentFormComponent implements OnInit {
  public course_id = input<string>();
  public id = input<string>();
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  public store = inject(AssignmentFormStore);

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
      const groups = this.store.groups();
      !!groups && this.setGroups(groups);
      this.cdr.detectChanges();
    });
    effect(() => {
      const assignment = this.store.assignment();
      if (assignment) {
        this.assignmentForm.patchValue(assignment);
        this.cdr.detectChanges();
      }
    });

    effect(() => {
      const id = this.id();
      !!id && this.store.fetchAssignment(id);
    });

    effect(() => {
      const course_id = this.course_id();
      if (course_id) {
        this.assignmentForm.get('course_id')?.patchValue(course_id);
        this.assignmentForm.get('course_id')?.disable();
      }
    });
  }

  public ngOnInit(): void {
    this.assignmentForm
      .get('course_id')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (courseId) =>
          asapScheduler.schedule(() => patchState(this.store, { courseId })),
      });

    this.assignmentForm
      .get('groups')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dates) =>
          asapScheduler.schedule(() => patchState(this.store, { dates })),
      });
  }

  get formGroups(): FormArray {
    return this.assignmentForm.get('groups') as FormArray;
  }

  private setGroups(groups: Partial<ClassGroup>[]): void {
    const control = this.assignmentForm.controls.groups;
    control.clear();
    groups.forEach((group) => {
      control.push(
        new FormGroup({
          group_id: new FormControl(group.id),
          date: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
          }),
        }),
      );
    });
  }

  public saveAssignment(): void {
    const value = this.assignmentForm.getRawValue();
    this.store.saveAssignment(value);
  }
}
