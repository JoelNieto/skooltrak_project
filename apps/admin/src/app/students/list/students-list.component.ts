import { IconsModule } from '@amithvns/ng-heroicons';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '@skooltrak/ui';

@Component({
  selector: 'sk-admin-students-list',
  standalone: true,
  imports: [IconsModule, RouterLink, ButtonDirective],
  template: ` <div class="relative overflow-x-auto mt-1">
    <div class="flex justify-between mb-4 py-2 px-1">
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
            class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for items"
          />
        </div>
      </div>

      <a skButton color="sky" routerLink="../new">New</a>
    </div>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
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
