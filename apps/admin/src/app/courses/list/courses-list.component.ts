import { IconsModule } from '@amithvns/ng-heroicons';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent, PaginatorComponent, UserChipComponent } from '@skooltrak/ui';

import { CoursesStore } from '../courses.store';

@Component({
  selector: 'sk-admin-courses-list',
  standalone: true,
  imports: [
    IconsModule,
    PaginatorComponent,
    TranslateModule,
    DatePipe,
    NgFor,
    NgIf,
    CardComponent,
    RouterLink,
    UserChipComponent,
  ],
  template: `
    <sk-card>
      <div header>
        <h2
          class="leading-tight tracking-tight flex text-gray-700 dark:text-white text-2xl font-title font-bold"
        >
          {{ 'Courses' | translate }}
        </h2>
      </div>
      <div class="relative overflow-x-auto mt-1">
        <div class="flex justify-between mb-4 py-2.5 px-1">
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
        </div>
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-600 dark:text-gray-200 font-title"
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
              class="bg-white border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600"
            >
              <th
                scope="row"
                class="px-6 py-2.5 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {{ course.subject?.name }}
              </th>
              <td class="px-6 py-2.5">{{ course.plan.name }}</td>
              <td class="px-6 py-2.5 flex">
                <sk-user-chip
                  *ngFor="let teacher of course.teachers"
                  [user]="teacher"
                />
              </td>
              <td class="px-6 py-2.5">{{ course.weekly_hours }}</td>
              <td class="px-6 py-2.5">
                {{ course.created_at | date : 'medium' }}
              </td>
              <td class="px-6 py-2.5 flex justify-center gap-2 content-center">
                <a routerLink="../details" [queryParams]="{ id: course.id }">
                  <icon name="eye" class="h-6 w-6 text-sky-500" />
                </a>
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
        <sk-paginator
          [count]="store.count()"
          [pageSize]="store.pageSize"
          (paginate)="getCurrentPage($event)"
        />
      </div>
    </sk-card>
  `,
})
export class CoursesListComponent {
  public store = inject(CoursesStore);

  getCurrentPage(pagination: { currentPage: number; start: number }): void {
    const { start } = pagination;
    this.store.setRange(start);
  }
}
