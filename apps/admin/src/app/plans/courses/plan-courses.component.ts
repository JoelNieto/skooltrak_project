import { IconsModule } from '@amithvns/ng-heroicons';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { Course } from '@skooltrak/models';
import { ButtonComponent } from '@skooltrak/ui';

import { PlanCoursesFormComponent } from './form/plans-courses-form.component';
import { PlanCourseStore } from './plan-courses.store';

@Component({
  selector: 'sk-admin-plan-courses',
  standalone: true,
  imports: [
    IconsModule,
    TranslateModule,
    ButtonComponent,
    DialogModule,
    JsonPipe,
    NgFor,
    NgIf,
    DatePipe,
  ],
  template: `<div class="relative overflow-x-auto mt-1">
    <div class="flex justify-between mb-4 py-3 px-1">
      <div>
        <label for="table-search" class="sr-only">Search</label>
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <icon
              name="magnifying-glass"
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
            />
          </div>
          <input
            type="text"
            id="table-search"
            class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
            placeholder="Search for items"
          />
        </div>
      </div>

      <button skooltrak-button color="green" (click)="newCourse()">
        {{ 'New' | translate }}
      </button>
    </div>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr class="cursor-pointer">
          <th scope="col" class="px-6 py-3">{{ 'Subject' | translate }}</th>
          <th scope="col" class="px-6 py-3">
            {{ 'Weekly hours' | translate }}
          </th>
          <th score="col" class="px-6 py-3">{{ 'Created' | translate }}</th>
          <th scope="col" class="px-6 py-3 text-center">
            {{ 'Actions' | translate }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          *ngFor="let course of store.courses()"
          [class.hidden]="store.loading()"
          class="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ course.subject?.name }}
          </th>
          <td class="px-6 py-4">{{ course.weekly_hours }}</td>
          <td class="px-6 py-4">{{ course.created_at | date : 'short' }}</td>
          <td class="px-6 py-4 flex justify-center gap-2 content-center">
            <button type="button" (click)="editCourse(course)">
              <icon name="pencil-square" class="h-6 w-6 text-green-500" />
            </button>
            <button type="button">
              <icon name="trash" class="h-6 w-6 text-red-600" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="animate-pulse mt-4" *ngIf="store.loading()">
      <h3 class="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-10/12"></h3>
      <ul class="mt-5 space-y-3">
        <li class="w-full h-4 bg-gray-200 rounded-md dark:bg-gray-700"></li>
        <li class="w-full h-4 bg-gray-200 rounded-md dark:bg-gray-700"></li>
        <li class="w-full h-4 bg-gray-200 rounded-md dark:bg-gray-700"></li>
        <li class="w-full h-4 bg-gray-200 rounded-md dark:bg-gray-700"></li>
      </ul>
    </div>
  </div>`,
  providers: [provideComponentStore(PlanCourseStore)],
})
export class PlanCoursesComponent {
  public store = inject(PlanCourseStore);
  courses = this.store.courses;
  dialog = inject(Dialog);

  newCourse() {
    const dialogRef = this.dialog.open<Partial<Course>>(
      PlanCoursesFormComponent,
      {
        minWidth: '36rem',
        disableClose: true,
      }
    );

    dialogRef.closed.subscribe({
      next: (request) => {
        !!request && this.store.saveCourse(request);
      },
    });
  }

  editCourse(course: Course) {
    const dialogRef = this.dialog.open<Partial<Course>>(
      PlanCoursesFormComponent,
      {
        minWidth: '36rem',
        disableClose: true,
        data: course,
      }
    );

    dialogRef.closed.subscribe({
      next: (request) => {
        !!request && this.store.saveCourse({ ...request, id: course.id });
      },
    });
  }
}
