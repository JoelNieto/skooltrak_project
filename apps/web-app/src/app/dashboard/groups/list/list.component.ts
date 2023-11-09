import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroEye, heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonDirective, CardComponent, PaginatorComponent } from '@skooltrak/ui';

import { UserChipComponent } from '../../../components/user-chip/user-chip.component';
import { GroupsStore } from '../groups.store';

@Component({
  standalone: true,
  selector: 'sk-groups-list',
  imports: [
    TranslateModule,
    CardComponent,
    NgIconComponent,
    PaginatorComponent,
    ButtonDirective,
    DatePipe,
    UserChipComponent,
    RouterLink,
  ],
  providers: [provideIcons({ heroMagnifyingGlass, heroEye })],
  template: `<sk-card>
    <div header>
      <h2
        class="font-title flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
      >
        {{ 'GROUPS.TITLE' | translate }}
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
              <ng-icon
                name="heroMagnifyingGlass"
                class="text-gray-500 dark:text-gray-400"
              />
            </div>
            <input
              type="text"
              id="table-search"
              class="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
              placeholder="Search for items"
            />
          </div>
        </div>
      </div>
      <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead
          class="bg-emerald-100 font-sans text-xs uppercase text-emerald-700 dark:bg-emerald-800 dark:text-gray-200"
        >
          <tr class="cursor-pointer">
            <th scope="col" class="rounded-tl-xl px-6 py-3">
              {{ 'Name' | translate }}
            </th>
            <th scope="col" class="px-6 py-3">{{ 'Plan' | translate }}</th>
            <th scope="col" class="px-6 py-3">
              {{ 'Teachers' | translate }}
            </th>
            <th scope="col" class="px-6 py-3">
              {{ 'Degree' | translate }}
            </th>
            <th score="col" class="px-6 py-3">{{ 'Created' | translate }}</th>
            <th scope="col" class="rounded-tr-xl px-6 py-3 text-center">
              {{ 'Actions' | translate }}
            </th>
          </tr>
        </thead>
        <tbody>
          @for(group of store.GROUPS(); track group.id) {
          <tr
            [class.hidden]="store.LOADING()"
            class="border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700"
          >
            <th
              scope="row"
              class="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white"
            >
              {{ group.name }}
            </th>
            <td class="px-6 py-2">{{ group.plan?.name }}</td>
            <td class="flex px-6 py-2">
              @for(teacher of group.teachers; track teacher.id) {
              <sk-user-chip [user]="teacher" />
              }
            </td>
            <td class="px-6 py-2">{{ group.degree.name }}</td>
            <td class="px-6 py-2">
              {{ group.created_at | date : 'medium' }}
            </td>
            <td class="flex items-center justify-center gap-2 px-6 py-4">
              <a routerLink="../details" [queryParams]="{ group_id: group.id }">
                <ng-icon name="heroEye" size="24" class="text-emerald-500" />
              </a>
            </td>
          </tr>
          }
        </tbody>
      </table>
      @if(store.LOADING()) {
      <div class="mt-4 animate-pulse">
        <h3 class="h-4 w-10/12 rounded-md bg-gray-200 dark:bg-gray-700"></h3>
        <ul class="mt-5 space-y-3">
          <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
          <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
          <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
          <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        </ul>
      </div>
      }

      <sk-paginator
        [count]="store.COUNT()"
        [pageSize]="store.PAGE_SIZE()"
        (paginate)="getCurrentPage($event)"
      /></div
  ></sk-card> `,
})
export class GroupsListComponent {
  public store = inject(GroupsStore);

  public getCurrentPage(pagination: {
    currentPage: number;
    start: number;
  }): void {
    const { start } = pagination;
    this.store.setRange(start);
  }
}
