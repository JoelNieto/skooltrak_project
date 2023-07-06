import { IconsModule } from '@amithvns/ng-heroicons';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Teacher } from '@skooltrak/models';
import { AvatarComponent, ButtonDirective } from '@skooltrak/ui';

import { TeachersFormComponent } from '../form/teachers-form.component';
import { TeacherStore } from '../teachers.store';

@Component({
  selector: 'sk-admin-teachers-list',
  standalone: true,
  imports: [
    ButtonDirective,
    IconsModule,
    RouterLink,
    DialogModule,
    TranslateModule,
    DatePipe,
    NgIf,
    NgFor,
    AvatarComponent,
  ],
  template: `<div class="relative overflow-x-auto mt-1">
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
            class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
            placeholder="Search for items"
          />
        </div>
      </div>

      <button skButton color="sky" (click)="newTeacher()">
        {{ 'New' | translate }}
      </button>
    </div>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr class="cursor-pointer">
          <th scope="col" class="px-6 py-3">{{ 'Name' | translate }}</th>
          <th scope="col" class="px-6 py-3">{{ 'Email' | translate }}</th>
          <th score="col" class="px-6 py-3">{{ 'Created' | translate }}</th>
          <th scope="col" class="px-6 py-3 text-center">
            {{ 'Actions' | translate }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          *ngFor="let teacher of store.teachers()"
          [class.hidden]="store.loading()"
          class="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        >
          <th
            scope="row"
            class="px-6 py-2.5 font-medium flex gap-2 items-center text-gray-900 whitespace-nowrap dark:text-white"
          >
            <sk-avatar
              [avatarUrl]="teacher.avatar_url!"
              [rounded]="true"
              class="h-6 w-6"
            />
            {{ teacher.first_name }} {{ teacher.father_name }}
          </th>
          <td class="px-6 py-2.5">{{ teacher.email }}</td>
          <td class="px-6 py-2.5">
            {{ teacher.created_at | date : 'medium' }}
          </td>
          <td class="px-6 py-2.5 flex justify-center gap-2 content-center">
            <button type="button">
              <icon name="pencil-square" class="h-6 w-6 text-green-500" />
            </button>
            <button type="button">
              <icon name="trash" class="h-6 w-6 text-red-600" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="animate-pulse mt-2" *ngIf="store.loading()">
      <h3 class="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-10/12"></h3>

      <ul class="mt-5 space-y-3">
        <li class="w-full h-4 bg-gray-200 rounded-md dark:bg-gray-700"></li>
        <li class="w-full h-4 bg-gray-200 rounded-md dark:bg-gray-700"></li>
        <li class="w-full h-4 bg-gray-200 rounded-md dark:bg-gray-700"></li>
        <li class="w-full h-4 bg-gray-200 rounded-md dark:bg-gray-700"></li>
      </ul>
    </div>
  </div> `,
})
export class TeachersListComponent {
  store = inject(TeacherStore);
  dialog = inject(Dialog);

  newTeacher() {
    const dialogRef = this.dialog.open<Partial<Teacher>>(
      TeachersFormComponent,
      {
        minWidth: '45%',
        disableClose: true,
      }
    );

    dialogRef.closed.subscribe({
      next: (request) => {
        console.info(request);
      },
    });
  }
}
