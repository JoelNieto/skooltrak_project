import { Dialog } from '@angular/cdk/dialog';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroChevronUpDown, heroEye, heroMagnifyingGlass, heroPencilSquare } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { Course } from '@skooltrak/models';
import { ButtonDirective, PaginatorComponent, SelectComponent, UtilService } from '@skooltrak/ui';

import { UserChipComponent } from '../../components/user-chip/user-chip.component';
import { SchoolCoursesFormComponent } from './courses-form.component';
import { SchoolCoursesStore } from './courses.store';

@Component({
  selector: 'sk-school-courses',
  standalone: true,
  imports: [
    TranslateModule,
    NgIconComponent,
    NgFor,
    UserChipComponent,
    NgIf,
    PaginatorComponent,
    DatePipe,
    RouterLink,
    ButtonDirective,
    SelectComponent,
    ReactiveFormsModule,
  ],
  providers: [
    UtilService,
    provideComponentStore(SchoolCoursesStore),
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
          [items]="store.DEGREES()"
          [formControl]="degreeControl"
          placeholder="COURSES.SELECT_DEGREE"
        />
      </div>
      <div class="flex-1">
        <sk-select
          label="name"
          [items]="store.PLANS()"
          [formControl]="planControl"
          placeholder="COURSES.SELECT_PLAN"
        />
      </div>
      <div class="flex flex-1 justify-end">
        <button skButton color="green" (click)="createCourse()">
          {{ 'New' | translate }}
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
        <tr
          *ngFor="let course of store.COURSES()"
          [class.hidden]="store.LOADING()"
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
            <sk-user-chip
              *ngFor="let teacher of course.teachers"
              [user]="teacher"
            />
          </td>
          <td class="px-6 py-3.5">{{ course.weekly_hours }}</td>
          <td class="px-6 py-3.5">
            {{ course.created_at | date : 'medium' }}
          </td>
          <td class="flex content-center justify-center gap-2 px-6 py-3.5">
            <button type="button" (click)="editCourse(course)">
              <ng-icon
                name="heroPencilSquare"
                class="text-green-500"
                size="24"
              />
            </button>
            <a
              routerLink="../../courses/details"
              [queryParams]="{ course_id: course.id }"
            >
              <ng-icon name="heroEye" size="24" class="text-sky-500" />
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4 animate-pulse" *ngIf="store.LOADING()">
      <h3 class="h-4 w-10/12 rounded-md bg-gray-200 dark:bg-gray-700"></h3>
      <ul class="mt-8 space-y-8">
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
      </ul>
    </div>
    <div
      *ngIf="!store.LOADING() && !store.COURSES().length"
      class="flex items-center justify-center"
    >
      <img src="/assets/teacher.svg" alt="" />
    </div>
    <sk-paginator
      [count]="store.COUNT()"
      [pageSize]="store.PAGE_SIZE"
      (paginate)="getCurrentPage($event)"
    />
  </div>`,
})
export class SchoolCoursesComponent implements OnInit {
  public store = inject(SchoolCoursesStore);
  private dialog = inject(Dialog);

  public degreeControl = new FormControl<string | undefined>(undefined, {
    nonNullable: true,
  });

  public planControl = new FormControl<string | undefined>(undefined, {
    nonNullable: true,
  });

  ngOnInit(): void {
    this.degreeControl.valueChanges.subscribe({
      next: (degree) => this.store.patchState({ SELECTED_DEGREE: degree }),
    });
    this.planControl.valueChanges.subscribe({
      next: (plan) => this.store.patchState({ SELECTED_PLAN: plan }),
    });
  }

  getCurrentPage(pagination: { currentPage: number; start: number }): void {
    const { start } = pagination;
    this.store.setRange(start);
  }

  public createCourse(): void {
    const dialogRef = this.dialog.open<Partial<Course>>(
      SchoolCoursesFormComponent,
      {
        minWidth: '36rem',
        disableClose: true,
        data: { plan_id: this.store.selectedPlan() },
      }
    );

    dialogRef.closed.subscribe({
      next: (request) => {
        !!request && this.store.saveCourse(request);
      },
    });
  }

  public editCourse(course: Partial<Course>): void {
    const dialogRef = this.dialog.open<Partial<Course>>(
      SchoolCoursesFormComponent,
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
