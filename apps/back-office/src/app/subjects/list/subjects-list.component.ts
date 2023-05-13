import { DatePipe, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';

import { SubjectsStore } from '../subjects.store';

@Component({
  selector: 'skooltrak-subjects-list',
  standalone: true,
  imports: [NgHeroiconsModule, RouterLink, DatePipe, NgFor],
  template: `<h3
      class="leading-tight tracking-tight text-gray-500 dark:text-gray-200 text-xl font-mono font-bold"
    >
      All
    </h3>
    <div class="relative overflow-x-auto mt-4 rounded-lg">
      <div class="flex justify-between mb-4 py-2 px-1">
        <div>
          <label for="table-search" class="sr-only">Search</label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <magnifying-glass-outline-icon
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
        <a
          routerLink="../new"
          class="text-white disabled:opacity-75 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          New
        </a>
      </div>
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-600 dark:text-gray-200"
        >
          <tr class="cursor-pointer">
            <th scope="col" class="px-6 py-3">Name</th>
            <th scope="col" class="px-6 py-3">Short name</th>
            <th scope="col" class="px-6 py-3">Description</th>
            <th score="col" class="px-6 py-3">Active</th>
            <th scope="col" class="px-6 py-3">Created</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="bg-white border-b dark:bg-gray-700 dark:border-gray-700"
            *ngFor="let subject of subjects()"
          >
            <th
              scope="row"
              class="px-6 py-4 font-bold flex gap-2 text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ subject.name }}
            </th>
            <td class="px-6 py-4">{{ subject.short_name }}</td>
            <td class="px-6 py-4">
              {{ subject.description }}
            </td>
            <td class="px-6 py-4">
              {{ subject.active }}
            </td>
            <td class="px-6 py-4">
              {{ subject.created_at | date : 'medium' }}
            </td>
            <td class="px-6 py-4 ">
              <div class="flex place-items-center gap-1">
                <a routerLink="../edit" [queryParams]="{ id: subject.id }">
                  <pencil-square-outline-icon
                    class="h-6 w-6 text-green-700 dark:text-green-200"
                  />
                </a>
                <a href="">
                  <trash-outline-icon
                    class="h-6 w-6 text-red-600 dark:text-red-200"
                  />
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`,
  styles: [],
})
export class SubjectsListComponent implements OnInit {
  private store = inject(SubjectsStore);
  public subjects = this.store.subjects;
  ngOnInit(): void {
    this.store.setSelected(undefined);
  }
}
