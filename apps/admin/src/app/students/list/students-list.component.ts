import { IconsModule } from '@amithvns/ng-heroicons';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@skooltrak/ui';

@Component({
  selector: 'skooltrak-admin-students-list',
  standalone: true,
  imports: [IconsModule, RouterLink, ButtonComponent],
  template: `<h3
      class="leading-tight tracking-tight text-gray-500 dark:text-gray-200 text-xl font-mono font-bold"
    >
      All
    </h3>
    <div class="relative overflow-x-auto mt-4">
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

        <button skooltrak-button color="red">Button</button>
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
