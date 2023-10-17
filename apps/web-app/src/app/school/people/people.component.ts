import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';

import { SchoolPeopleStore } from './people.store';

@Component({
  standalone: true,
  selector: 'sk-school-people',
  imports: [TranslateModule, NgIconComponent],
  providers: [
    provideComponentStore(SchoolPeopleStore),
    provideIcons({ heroMagnifyingGlass }),
  ],
  styles: [
    `
      input,
      select,
      textarea {
        @apply block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm;
        &.ng-invalid.ng-dirty {
          @apply border-red-400 bg-red-100 text-red-800 focus:border-red-600 focus:ring-red-600;
        }
      }

      label {
        @apply mb-2 block font-sans text-sm font-medium text-gray-600 dark:text-white;
      }
    `,
  ],
  template: `<div class="relative overflow-x-auto">
    <div class="mb-4 flex justify-between gap-4 p-1">
      <div class="flex-1">
        <select name="">
          <option>{{ 'PEOPLE.ALL' | translate }}</option>
          <option>{{ 'PEOPLE.TEACHERS' | translate }}</option>
          <option>{{ 'PEOPLE.ADMINS' | translate }}</option>
          <option>{{ 'PEOPLE.STUDENTS' | translate }}</option>
        </select>
      </div>
      <div class="flex-1">
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
              class="pl-10"
              placeholder="Search for items"
            />
          </div>
        </div>
      </div>
    </div>
  </div>`,
})
export class SchoolPeopleComponent {}
