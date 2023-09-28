import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { ButtonDirective } from '@skooltrak/ui';

@Component({
  selector: 'sk-admin-students-list',
  standalone: true,
  imports: [NgIconComponent, RouterLink, ButtonDirective],
  providers: [provideIcons({ heroMagnifyingGlass })],
  template: ` <div class="relative mt-1 overflow-x-auto">
    <div class="mb-4 flex justify-between px-1 py-2">
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
            class="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Search for items"
          />
        </div>
      </div>

      <a skButton color="sky" routerLink="../new">New</a>
    </div>
    <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <thead
        class="bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr class="cursor-pointer">
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3">Short name</th>
          <th scope="col" class="px-6 py-3">Type</th>
          <th score="col" class="px-6 py-3">Country</th>
          <th scope="col" class="px-6 py-3">Created By</th>
          <th scope="col" class="px-6 py-3">Created</th>
          <th scope="col" class="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>`,
  styles: [],
})
export class StudentsListComponent {}
