import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPencil } from '@ng-icons/heroicons/outline';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { Grade } from '@skooltrak/models';
import { ButtonDirective, SelectComponent } from '@skooltrak/ui';

import { CourseDetailsStore } from '../details/course-details.store';
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
  ],
  styles: [
    `
      th {
        max-width: 5.5rem;
      }

      tr > th:first-child {
        max-width: 7rem;
      }
    `,
  ],
  providers: [CourseGradesStore, provideIcons({ heroPencil })],
  template: `
    <div class="mb-4 mt-2 flex justify-between">
      <div class="w-64">
        <sk-select
          [formControl]="periodControl"
          [items]="store.periods()"
          label="name"
          [search]="false"
        />
      </div>
      <button skButton color="green" (click)="newGrade()">
        + {{ 'New' | translate }}
      </button>
    </div>
    <div class="max-h-96 w-auto overflow-auto">
      <table class="text-left text-sm text-gray-500 dark:text-gray-400">
        <thead
          class="bg-gray-50 font-sans text-xs text-gray-700 dark:bg-gray-600 dark:text-gray-200"
        >
          <tr>
            <th
              scope="col"
              class="sticky left-0 top-0 w-16 bg-gray-50 px-6 py-3 font-bold uppercase"
            >
              {{ 'Student' | translate }}
            </th>
            @for (grade of store.grades(); track grade.id) {
              <th
                scope="col"
                class="sticky top-0 whitespace-nowrap bg-gray-50 px-2 py-3 font-semibold"
                (click)="editGrade(grade)"
              >
                <div class="flex">
                  <div class="overflow-hidden text-ellipsis whitespace-nowrap">
                    {{ grade.title }}
                  </div>
                  <button>
                    <ng-icon
                      name="heroPencil"
                      size="16"
                      class="text-transparent hover:text-green-600"
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
                <td class="border px-2 py-2.5 text-center">
                  4.0
                  <button>
                    <ng-icon
                      name="heroPencil"
                      size="16"
                      class="text-transparent hover:text-green-600"
                    />
                  </button>
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
      this.periodControl.setValue(this.courseStore.course()?.period_id);
      this.periodControl.valueChanges.subscribe({
        next: (periodId) => patchState(this.store, { periodId }),
      });
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
