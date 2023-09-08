import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroEye,
  heroMagnifyingGlass,
  heroPencilSquare,
  heroTrash,
} from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { Course } from '@skooltrak/models';
import {
  AvatarComponent,
  ButtonDirective,
  UserChipComponent,
} from '@skooltrak/ui';

import { PlanCoursesFormComponent } from './form/plans-courses-form.component';
import { PlanCourseStore } from './plan-courses.store';

@Component({
  selector: 'sk-admin-plan-courses',
  standalone: true,
  imports: [
    NgIconComponent,
    TranslateModule,
    ButtonDirective,
    DialogModule,
    JsonPipe,
    NgFor,
    NgIf,
    DatePipe,
    RouterLink,
    AvatarComponent,
    UserChipComponent,
  ],
  providers: [
    provideComponentStore(PlanCourseStore),
    provideIcons({ heroMagnifyingGlass, heroEye, heroTrash, heroPencilSquare }),
  ],
  template: `<div class="relative mt-1 overflow-x-auto">
    <div class="mb-4 flex justify-between px-1 py-3">
      <div>
        <label for="table-search" class="sr-only">Search</label>
        <div class="relative">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <ng-icon
              name="heroMagnifyingGlass"
              class="text-gray-500 dark:text-gray-400"
            />
          </div>
          <input
            type="text"
            id="table-search"
            class="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500"
            placeholder="Search for items"
          />
        </div>
      </div>

      <button skButton color="green" (click)="newCourse()">
        {{ 'New' | translate }}
      </button>
    </div>
    <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <thead
        class="font-title bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-600 dark:text-gray-300"
      >
        <tr class="cursor-pointer">
          <th scope="col" class="px-6 py-3">{{ 'Subject' | translate }}</th>
          <th scope="col" class="px-6 py-3">{{ 'Teachers' | translate }}</th>
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
          class="border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700"
        >
          <th
            scope="row"
            class="whitespace-nowrap px-6 py-2.5 font-medium text-gray-900 dark:text-white"
          >
            {{ course.subject?.name }}
          </th>
          <td class="flex px-6 py-2.5">
            <sk-user-chip
              *ngFor="let teacher of course.teachers"
              [user]="teacher"
            />
          </td>
          <td class="px-6 py-2.5">{{ course.weekly_hours }}</td>
          <td class="px-6 py-2.5">{{ course.created_at | date : 'short' }}</td>
          <td class="flex content-center justify-center gap-2 px-6 py-2.5">
            <a
              routerLink="/app/courses/details"
              [queryParams]="{ id: course.id }"
            >
              <ng-icon name="heroEye" size="24" class="text-sky-500" />
            </a>
            <button type="button" (click)="editCourse(course)">
              <ng-icon
                name="heroPencilSquare"
                size="24"
                class=" text-green-500"
              />
            </button>
            <button type="button">
              <ng-icon name="heroTrash" size="24" class="text-red-600" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4 animate-pulse" *ngIf="store.loading()">
      <h3 class="h-4 w-10/12 rounded-md bg-gray-200 dark:bg-gray-700"></h3>
      <ul class="mt-5 space-y-3">
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
      </ul>
    </div>
  </div>`,
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
        maxWidth: '55%',
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
