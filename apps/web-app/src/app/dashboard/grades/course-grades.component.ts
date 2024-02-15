import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPencil } from '@ng-icons/heroicons/outline';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { Grade } from '@skooltrak/models';
import { ButtonDirective, SelectComponent } from '@skooltrak/ui';

import { CourseDetailsStore } from '../courses/details/course-details.store';
import { GradeItemFormComponent } from '../grade-item-form/grade-item-form.component';
import { GradesFormComponent } from '../grades-form/grades-form.component';
import { CourseGradesStore } from './course-grades.store';

@Component({
  standalone: true,
  selector: 'sk-course-grades',
  imports: [
    TranslateModule,
    NgIconComponent,
    SelectComponent,
    ButtonDirective,
    DialogModule,
    ReactiveFormsModule,
    GradeItemFormComponent,
    MatFormField,
    MatSelect,
    MatLabel,
    MatOption,
  ],
  styles: [
    `
      th {
        width: 5.5rem;
      }

      tr > th:first-child {
        width: 8rem;
      }
    `,
  ],
  providers: [CourseGradesStore, provideIcons({ heroPencil })],
  template: `
    <div class="mb-4 mt-2 flex justify-between items-baseline">
      <mat-form-field class="w-64">
        <mat-label>{{ 'SELECT.SELECT_VALUE' | translate }}</mat-label>
        <mat-select [formControl]="periodControl">
          @for (period of store.periods(); track period.id) {
            <mat-option [value]="period.id">{{ period.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <button skButton color="green" (click)="newGrade()">
        + {{ 'GRADES.NEW' | translate }}
      </button>
    </div>
    <div class="max-h-96 w-auto overflow-auto">
      <table class="text-left text-sm text-gray-500 dark:text-gray-400">
        <thead class="font-sans text-xs text-gray-700 dark:text-gray-200">
          <tr>
            <th
              scope="col"
              class="sticky left-0 top-0 w-16  px-6 py-3 font-bold uppercase"
            >
              {{ 'Student' | translate }}
            </th>
            @for (grade of store.grades(); track grade.id) {
              <th
                scope="col"
                class="sticky top-0 whitespace-nowrap px-2 py-3 font-semibold"
                (click)="editGrade(grade)"
              >
                <div class="flex justify-between">
                  <div class="overflow-hidden text-ellipsis whitespace-nowrap">
                    {{ grade.title }}
                  </div>
                  <button>
                    <ng-icon
                      name="heroPencil"
                      size="16"
                      class="text-green-600"
                    />
                  </button>
                </div>
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (student of store.students(); track student) {
            <tr
              class="border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700"
            >
              <th
                scope="row"
                class="sticky left-0 whitespace-nowrap  bg-white px-3 py-2.5 font-medium text-gray-900 dark:text-white"
              >
                {{ student.first_name }} {{ student.father_name }}
              </th>
              @for (grade of store.grades(); track grade) {
                <td class="border-t px-2 py-1 text-center">
                  <sk-grade-item-form
                    [gradeId]="grade.id!"
                    [studentId]="student.id!"
                  />
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class CourseGradesComponent implements OnInit {
  private courseStore = inject(CourseDetailsStore);
  private dialog = inject(Dialog);
  public store = inject(CourseGradesStore);

  public periodControl = new FormControl<string | undefined>(
    this.store.course()?.period_id,
    {
      nonNullable: true,
    },
  );

  public ngOnInit(): void {
    setTimeout(() => {
      this.periodControl.valueChanges.subscribe({
        next: (periodId) => patchState(this.store, { periodId }),
      });
      this.periodControl.setValue(this.courseStore.course()?.period_id);
    }, 1000);
  }

  public newGrade(): void {
    this.dialog
      .open(GradesFormComponent, {
        minWidth: '42rem',
        disableClose: true,
        data: { course: this.courseStore.course() },
      })
      .closed.subscribe({ next: () => this.store.refresh() });
  }

  public editGrade(grade: Partial<Grade>): void {
    this.dialog.open(GradesFormComponent, {
      minWidth: '42rem',
      disableClose: true,
      data: { course: this.courseStore.course(), grade },
    });
  }
}
