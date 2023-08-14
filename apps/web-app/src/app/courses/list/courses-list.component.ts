import { IconsModule } from '@amithvns/ng-heroicons';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent, PaginatorComponent, TabsComponent, TabsItemComponent, UserChipComponent } from '@skooltrak/ui';

import { CoursesStore } from '../courses.store';

@Component({
  standalone: true,
  selector: 'sk-courses-list',
  imports: [
    CardComponent,
    TranslateModule,
    TabsComponent,
    TabsItemComponent,
    IconsModule,
    UserChipComponent,
    RouterLink,
    PaginatorComponent,
    NgFor,
    DatePipe,
    NgIf,
  ],
  template: ` <sk-card>
    <div header>
      <h2
        class="font-title flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
      >
        {{ 'Courses' | translate }}
      </h2>
    </div>
    <div class="relative mt-1 overflow-x-auto">
      <div class="mb-4 flex justify-between px-1 py-3.5">
        <div>
          <label for="table-search" class="sr-only">Search</label>
          <div class="relative">
            <div
              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
            >
              <icon
                name="magnifying-glass"
                class="h-5 w-5 text-gray-500 dark:text-gray-400"
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
      </div>
      <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead
          class="font-title bg-gray-100 text-xs font-semibold uppercase text-gray-700 dark:bg-gray-600 dark:text-gray-200"
        >
          <tr class="cursor-pointer">
            <th scope="col" class="px-6 py-3">{{ 'Subject' | translate }}</th>
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
            *ngFor="let course of store.courses()"
            [class.hidden]="store.loading()"
            class="border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700"
          >
            <th
              scope="row"
              class="whitespace-nowrap px-6 py-3.5 font-medium text-gray-900 dark:text-white"
            >
              {{ course.subject?.name }}
            </th>
            <td class="px-6 py-3.5">{{ course.plan.name }}</td>
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
              <a
                routerLink="../details"
                [queryParams]="{ course_id: course.id }"
              >
                <icon name="eye" class="h-6 w-6 text-sky-500" />
              </a>
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
      <sk-paginator
        [count]="store.count()"
        [pageSize]="store.pageSize"
        (paginate)="getCurrentPage($event)"
      />
    </div>
  </sk-card>`,
})
export class CoursesListComponent {
  public store = inject(CoursesStore);

  getCurrentPage(pagination: { currentPage: number; start: number }): void {
    const { start } = pagination;
    this.store.setRange(start);
  }
}
