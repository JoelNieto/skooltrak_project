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
import { MatButton } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { patchState } from '@ngrx/signals';
import { DropzoneCdkModule, FileInputValue } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { TranslateModule } from '@ngx-translate/core';
import { ClassGroup } from '@skooltrak/models';
import { asapScheduler } from 'rxjs';

import { AssignmentFormStore } from './assignment-form.store';

@Component({
  selector: 'sk-assignment-form',
  imports: [
    TranslateModule,
    MatButton,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggle,
    MatDatepickerModule,
    DropzoneCdkModule,
    DropzoneMaterialModule,
    MatChipsModule,
  ],
  styles: [],
  providers: [AssignmentFormStore],
  template: `
    <form
      class="flex gap-8"
      [formGroup]="assignmentForm"
      (ngSubmit)="saveAssignment()"
    >
      <div class="flex-1">
        <div class="flex items-start justify-between">
          <h3 class="mat-headline-large">
            {{ (id() ? 'ASSIGNMENTS.EDIT' : 'ASSIGNMENTS.NEW') | translate }}
          </h3>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <mat-form-field>
            <mat-label for="title">{{ 'NAME' | translate }}</mat-label>
            <input matInput type="text" name="title" formControlName="title" />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="course" skLabel
              >{{ 'COURSES.TITLE' | translate }}
            </mat-label>
            <mat-select formControlName="course_id">
              @for (course of store.courses(); track course.id) {
                <mat-option [value]="course.id">
                  {{ course.subject?.name }} - {{ course.plan.name }}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label for="type">{{ 'TYPE' | translate }}</mat-label>
            <mat-select formControlName="type_id">
              @for (type of store.types(); track type.id) {
                <mat-option [value]="type.id">{{ type.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <div class="flex items-baseline pb-3">
            <mat-slide-toggle formControlName="upload_file"
              >{{ 'ASSIGNMENTS.UPLOAD_FILE' | translate }}
            </mat-slide-toggle>
          </div>

          <mat-form-field class="col-span-2">
            <mat-label for="description"
              >{{ 'DESCRIPTION' | translate }}
            </mat-label>
            <textarea
              formControlName="description"
              matInput
              rows="5"
            ></textarea>
          </mat-form-field>
          <mat-form-field class="col-span-2">
            <mat-label>{{ 'ASSIGNMENTS.ATTACHMENTS' | translate }}</mat-label>
            <ngx-mat-dropzone>
              <input
                type="file"
                multiple
                fileInput
                [formControl]="fileControl"
              />
              @for (file of files; track file) {
                <mat-chip-row (removed)="removeFile(file)" color="accent">
                  {{ file.name }}
                  <button matChipRemove>
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip-row>
              }
            </ngx-mat-dropzone>
            <mat-icon matSuffix color="primary">cloud_upload</mat-icon>
          </mat-form-field>
        </div>
        <div class="flex justify-end pt-6">
          <button
            mat-flat-button
            color="accent"
            type="submit"
            [disabled]="assignmentForm.invalid"
          >
            {{ 'SAVE_CHANGES' | translate }}
          </button>
        </div>
      </div>
      <div class="w-80 flex-none">
        <div>
          <h2 class="mat-title-large">
            {{ 'GROUPS.DATES' | translate }}
          </h2>
        </div>
        <div formArrayName="groups" class="mt-4 flex flex-col gap-4">
          @for (group of formGroups.controls; track group; let i = $index) {
            <ng-container>
              <mat-form-field [formGroupName]="i">
                <mat-label>{{ store.groups()[i].name }}</mat-label>
                <input
                  formControlName="date"
                  matInput
                  [matDatepicker]="datePicker"
                />
                <mat-datepicker-toggle matIconSuffix [for]="datePicker" />
                <mat-datepicker #datePicker />
              </mat-form-field>
            </ng-container>
          }
        </div>
      </div>
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
  public fileControl = new FormControl<FileInputValue>(null);

  get files(): File[] {
    const files = this.fileControl.value;

    if (!files) return [];

    return Array.isArray(files) ? files : [files];
  }

  public removeFile(file: File): void {
    if (Array.isArray(this.fileControl.value)) {
      this.fileControl.setValue(
        this.fileControl.value.filter((i) => i !== file),
      );

      return;
    }

    this.fileControl.setValue(null);
  }

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
    upload_file: new FormControl<boolean>(false, { nonNullable: true }),
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
    this.store.saveAssignment({ request: value, files: this.files });
  }
}
