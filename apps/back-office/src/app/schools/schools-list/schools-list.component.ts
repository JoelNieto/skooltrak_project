import { AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';

import { SchoolsService } from '../schools.service';
import { SchoolsStore } from '../schools.store';

@Component({
  selector: 'skooltrak-schools-list',
  standalone: true,
  imports: [NgFor, AsyncPipe, DatePipe],
  providers: [provideComponentStore(SchoolsStore), SchoolsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2
      class="leading-tight tracking-tight text-gray-700 dark:text-gray-50 text-2xl font-serif font-bold"
    >
      Schools
    </h2>
    <div class="relative overflow-x-auto mt-4 rounded-lg border">
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
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ school.full_name }}
            </th>
            <td class="px-6 py-4">{{ school.short_name }}</td>
            <td class="px-6 py-4">{{ school.is_public }}</td>
            <td class="px-6 py-4">{{ school.created_at | date : 'medium' }}</td>
            <td class="px-6 py-4">{{ school.updated_at | date : 'medium' }}</td>
            <td class="px-6 py-4"></td>
          </tr>
        </tbody>
      </table>
    </div> `,
  styles: [],
})
export class SchoolsListComponent implements AfterViewInit {
  private readonly store = inject(SchoolsStore);
  public schools$ = this.store.schools$;
  ngAfterViewInit(): void {
    this.store.schools$.subscribe({
      next: (schools) => {
        console.log(schools);
      },
    });
  }
}
