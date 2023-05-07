import { AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SchoolsStore } from '../schools.store';

@Component({
  selector: 'skooltrak-schools-list',
  standalone: true,
  imports: [NgFor, AsyncPipe, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2
      class="leading-tight tracking-tight text-gray-700 dark:text-white text-2xl font-mono font-bold"
    >
      Schools
    </h2>
    <div class="relative overflow-x-auto mt-4 rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Name</th>
            <th scope="col" class="px-6 py-3">Short name</th>
            <th scope="col" class="px-6 py-3">Is Public</th>
            <th scope="col" class="px-6 py-3">Created</th>
            <th scope="col" class="px-6 py-3">Updated</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            *ngFor="let school of schools$ | async"
          >
            <th
              scope="row"
              class="px-6 py-4 font-bold flex gap-2 text-gray-900 whitespace-nowrap dark:text-white"
            >
              <img [src]="school.logo_url" class="h-10 max-w-full " alt="" />
              <div class="flex flex-col">
                {{ school.full_name }}
                <a
                  [href]="school.website"
                  class="text-gray-400 text-xs font-light"
                >
                  {{ school.website }}
                </a>
              </div>
            </th>
            <td class="px-6 py-4">{{ school.short_name }}</td>
            <td class="px-6 py-4">
              <span class="rounded-full py-1 px-4 bg-green-100 text-green-600">
                {{ school.is_public }}
              </span>
            </td>
            <td class="px-6 py-4">{{ school.created_at | date : 'medium' }}</td>
            <td class="px-6 py-4">{{ school.updated_at | date : 'medium' }}</td>
            <td class="px-6 py-4 flex gap-1">
              <a routerLink="../details" [queryParams]="{ id: school._id }">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  class="h-6 w-6 text-blue-700 dark:text-blue-200"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  ></path></svg
              ></a>
              <a href="">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  class="h-6 w-6 text-red-600 dark:text-red-200"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  ></path>
                </svg>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div> `,
  styles: [
    `
      th {
        @apply font-mono;
      }
    `,
  ],
})
export class SchoolsListComponent {
  private readonly store = inject(SchoolsStore);
  public schools$ = this.store.schools$;
}
