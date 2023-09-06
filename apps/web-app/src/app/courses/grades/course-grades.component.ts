import { IconsModule } from '@amithvns/ng-heroicons';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
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
    IconsModule,
    SelectComponent,
    ButtonDirective,
    DialogModule,
  ],
  styles: [
    `
      th {
        max-width: 5rem;
      }

      tr > th:first-child {
        max-width: unset;
      }
    `,
  ],
  providers: [provideComponentStore(CourseGradesStore)],
  template: `
    <div class="mb-4 mt-2 flex justify-between">
      <div class="w-64">
        <sk-select [items]="groups()" label="name" />
      </div>
      <button skButton color="green" (click)="newGrade()">
        {{ 'New' | translate }}
      </button>
    </div>
    <div class="max-h-96 w-auto overflow-auto">
      <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead
          class="bg-gray-50 font-sans text-xs text-gray-700 dark:bg-gray-600 dark:text-gray-200"
        >
          <tr>
            <th
              scope="col"
              class="sticky left-0 top-0 bg-gray-50 px-6 py-3 font-bold uppercase"
            >
              {{ 'Student' | translate }}
            </th>
            <th
              *ngFor="let grade of grades"
              scope="col"
              class="sticky top-0 w-10 whitespace-nowrap bg-gray-50 px-2 py-3 font-semibold"
            >
              <div class="flex">
                <div class="overflow-hidden text-ellipsis whitespace-nowrap">
                  Tarea de Ciencias {{ grade }}
                </div>
                <button>
                  <icon
                    name="pencil"
                    class="h-4 text-transparent hover:text-green-600"
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
              class="sticky left-0 whitespace-nowrap bg-white px-3 py-2.5 font-medium text-gray-900 dark:text-white"
            >
              Joel Nieto
            </th>
            <td
              class="border px-2 py-2.5 text-center"
              *ngFor="let grade of grades"
            >
              4.0
              <button>
                <icon
                  name="pencil"
                  class="h-4 text-transparent hover:text-green-600"
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class CourseGradesComponent {
  public students = Array.from(Array(20).keys());
  public grades = Array.from(Array(15).keys());
  private courseStore = inject(CoursesStore);
  private dialog = inject(Dialog);
  private store = inject(CourseGradesStore);
  public groups = this.store.groups;

  newGrade() {
    const dialogRef = this.dialog.open<Partial<Grade>>(GradesFormComponent, {
      minWidth: '42rem',
      disableClose: true,
      data: { course: this.courseStore.selected() },
    });
    dialogRef.closed.subscribe({
      next: (request) => {
        console.info(request);
      },
    });
  }
}
