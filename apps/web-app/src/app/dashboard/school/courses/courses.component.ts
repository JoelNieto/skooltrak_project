import { Dialog } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroChevronUpDown,
  heroEye,
  heroMagnifyingGlass,
  heroPencilSquare,
} from '@ng-icons/heroicons/outline';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { Course } from '@skooltrak/models';
import {
  ButtonDirective,
  PaginatorComponent,
  SelectComponent,
  UtilService,
} from '@skooltrak/ui';

import { UserChipComponent } from '../../../components/user-chip/user-chip.component';
import { SchoolCoursesFormComponent } from './courses-form.component';
import { SchoolCoursesStore } from './courses.store';

@Component({
  selector: 'sk-school-courses',
  standalone: true,
  imports: [
    TranslateModule,
    NgIconComponent,
    UserChipComponent,
    PaginatorComponent,
    DatePipe,
    RouterLink,
    ButtonDirective,
    SelectComponent,
    ReactiveFormsModule,
  ],
  providers: [
    UtilService,
    SchoolCoursesStore,
    provideIcons({
      heroMagnifyingGlass,
      heroEye,
      heroChevronUpDown,
      heroPencilSquare,
    }),
  ],
  template: ` <div class="relative overflow-x-auto">
    <div class="mb-4 flex flex-nowrap justify-between gap-4 px-1 py-2">
      <div class="flex-1">
        <sk-select
          label="name"
          [items]="store.degrees()"
          [formControl]="degreeControl"
          placeholder="COURSES.SELECT_DEGREE"
        />
      </div>
      <div class="flex-1">
        <sk-select
          label="name"
          [items]="store.plans()"
          [formControl]="planControl"
          placeholder="COURSES.SELECT_PLAN"
        />
      </div>
      <div class="flex flex-1 justify-end">
        <button skButton color="green" (click)="createCourse()">
          {{ 'NEW' | translate }}
        </button>
      </div>
    </div>
    <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <thead
        class="bg-gray-100 font-sans text-xs font-semibold uppercase text-gray-700 dark:bg-gray-600 dark:text-gray-200"
      >
        <tr class="cursor-pointer">
          <th scope="col" class="flex items-center gap-3 px-6 py-3">
            {{ 'Subject' | translate }}
            <ng-icon name="heroChevronUpDown" size="18" />
          </th>
          <th scope="col" class="px-6 py-3">{{ 'Plan' | translate }}</th>
          <th scope="col" class="px-6 py-3">
            {{ 'Teachers' | translate }}
          </th>
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
        @for (course of store.courses(); track course.id) {
          <tr
            [class.hidden]="store.loading()"
            class="border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700"
          >
            <th
              scope="row"
              class="whitespace-nowrap px-6 py-3.5 font-medium text-gray-900 dark:text-white"
            >
              {{ course.subject?.name }}
            </th>
            <td class="px-6 py-3.5">{{ course.plan?.name }}</td>
            <td class="flex px-6 py-3.5">
              @for (teacher of course.teachers; track teacher.id) {
                <sk-user-chip [user]="teacher" />
              }
            </td>
            <td class="px-6 py-3.5">{{ course.weekly_hours }}</td>
            <td class="px-6 py-3.5">
              {{ course.created_at | date: 'medium' }}
            </td>
            <td class="flex content-center justify-center gap-2 px-6 py-3.5">
              <a
                routerLink="../../courses/details"
                [queryParams]="{ course_id: course.id }"
              >
                <ng-icon name="heroEye" size="24" class="text-sky-500" />
              </a>
              <button type="button" (click)="editCourse(course)">
                <ng-icon
                  name="heroPencilSquare"
                  class="text-green-500"
                  size="24"
                />
              </button>
            </td>
          </tr>
        }
      </tbody>
    </table>
    @if (store.loading()) {
      <div class="mt-4 animate-pulse">
        <h3 class="h-4 w-10/12 rounded-md bg-gray-200 dark:bg-gray-700"></h3>
        <ul class="mt-8 space-y-8">
          <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
          <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
          <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
          <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        </ul>
      </div>
    }
    @if (!store.loading() && !store.courses().length) {
      <div class="flex flex-col items-center justify-center gap-4 py-12">
        <img
          src="/assets/images/books-lineal-colored.svg"
          class="h-24"
          alt=""
        />
        <p class="font-sans italic text-gray-400">
          {{ 'NO_ITEMS' | translate }}
        </p>
      </div>
    }
    <sk-paginator [count]="store.count()" (paginate)="getCurrentPage($event)" />
  </div>`,
})
export class SchoolCoursesComponent implements OnInit {
  public store = inject(SchoolCoursesStore);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(Dialog);

  public degreeControl = new FormControl<string | undefined>(undefined, {
    nonNullable: true,
  });

  public planControl = new FormControl<string | undefined>(undefined, {
    nonNullable: true,
  });

  public ngOnInit(): void {
    this.degreeControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (degreeId) => patchState(this.store, { degreeId }),
      });
    this.planControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (planId) => patchState(this.store, { planId }),
      });
  }

  public getCurrentPage(pagination: { pageSize: number; start: number }): void {
    const { start, pageSize } = pagination;
    patchState(this.store, { start, pageSize });
  }

  public createCourse(): void {
    this.dialog
      .open<Partial<Course>>(SchoolCoursesFormComponent, {
        width: '36rem',
        maxWidth: '75%',
        disableClose: true,
        data: { plan_id: this.store.planId() },
      })
      .closed.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (request) => {
          !!request && this.store.saveCourse(request);
        },
      });
  }

  public editCourse(course: Partial<Course>): void {
    this.dialog
      .open<Partial<Course>>(SchoolCoursesFormComponent, {
        width: '36rem',
        maxWidth: '75%',
        disableClose: true,
        data: course,
      })
      .closed.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (request) => {
          !!request && this.store.saveCourse({ ...request, id: course.id });
        },
      });
  }

  public deleteCourse(course: Course): void {
    const { id } = course;
    if (!id) return;
  }
}
