import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPencil } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { Grade } from '@skooltrak/models';
import { ButtonDirective, SelectComponent } from '@skooltrak/ui';

import { CoursesStore } from '../courses.store';
import { GradesFormComponent } from '../grades-form/grades-form.component';
import { CourseGradesStore } from './course-grades.store';

@Component({
  standalone: true,
  selector: 'sk-course-grades',
  imports: [
    TranslateModule,
    NgFor,
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
  providers: [
    provideComponentStore(CourseGradesStore),
    provideIcons({ heroPencil }),
  ],
  template: `
    <div class="mb-4 mt-2 flex justify-between">
      <div class="w-64">
        <sk-select
          [formControl]="periodControl"
          [items]="periods()"
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
            <th
              *ngFor="let grade of grades"
              scope="col"
              class="sticky top-0 whitespace-nowrap bg-gray-50 px-2 py-3 font-semibold"
            >
              <div class="flex">
                <div class="overflow-hidden text-ellipsis whitespace-nowrap">
                  Tarea de Ciencias {{ grade }}
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
          </tr>
        </thead>
        <tbody>
          <tr
            *ngFor="let student of students"
            class="border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700"
          >
            <th
              scope="row"
              class="sticky left-0 whitespace-nowrap  bg-white px-3 py-2.5 font-medium text-gray-900 dark:text-white"
            >
              Joel Nieto
            </th>
            <td
              class="border px-2 py-2.5 text-center"
              *ngFor="let grade of grades"
            >
              4.0
              <button>
                <ng-icon
                  name="heroPencil"
                  size="16"
                  class="text-transparent hover:text-green-600"
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class CourseGradesComponent implements OnInit {
  public students = Array.from(Array(20).keys());
  public grades = Array.from(Array(15).keys());
  private courseStore = inject(CoursesStore);
  private dialog = inject(Dialog);
  private store = inject(CourseGradesStore);
  public periods = this.store.periods;
  periodControl = new FormControl<string | undefined>(
    this.store.course()?.period_id,
    {
      nonNullable: true,
    }
  );

  public ngOnInit(): void {
    this.periodControl.setValue(this.store.period());
  }

  newGrade() {
    this.dialog.open<Partial<Grade>>(GradesFormComponent, {
      minWidth: '42rem',
      disableClose: true,
      data: { course: this.courseStore.selected() },
    });
  }
}
