import { IconsModule } from '@amithvns/ng-heroicons';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { Degree } from '@skooltrak/models';
import { ButtonComponent, ConfirmationService, PaginatorComponent, UtilService } from '@skooltrak/ui';

import { SchoolDegreesStore } from './degrees.store';
import { DegreesFormComponent } from './form/degrees-form.component';

@Component({
  selector: 'sk-admin-school-degrees',
  standalone: true,
  imports: [
    IconsModule,
    TranslateModule,
    DatePipe,
    PaginatorComponent,
    NgFor,
    NgIf,
    ButtonComponent,
    DialogModule,
  ],
  providers: [
    provideComponentStore(SchoolDegreesStore),
    UtilService,
    ConfirmationService,
  ],
  template: `<div class="relative overflow-x-auto mt-1">
    <div class="flex justify-between mb-4 py-4 px-1">
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

      <button skooltrak-button color="green" (click)="newDegree()">
        {{ 'New' | translate }}
      </button>
    </div>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-600 dark:text-gray-300 font-title"
      >
        <tr class="cursor-pointer">
          <th scope="col" class="px-6 py-3">{{ 'Name' | translate }}</th>
          <th scope="col" class="px-6 py-3">{{ 'Level' | translate }}</th>
          <th score="col" class="px-6 py-3">{{ 'Created' | translate }}</th>
          <th scope="col" class="px-6 py-3 text-center">
            {{ 'Actions' | translate }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          *ngFor="let degree of store.degrees()"
          [class.hidden]="store.loading()"
          class="bg-white border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ degree.name }}
          </th>
          <td class="px-6 py-4">{{ degree.level?.name }}</td>
          <td class="px-6 py-4">{{ degree.created_at | date : 'short' }}</td>
          <td class="px-6 py-4 flex justify-center gap-2 content-center">
            <button type="button" (click)="editDegree(degree)">
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

    <skooltrak-paginator
      [count]="store.count()"
      [pageSize]="store.pageSize"
      (paginate)="getCurrentPage($event)"
    />
  </div>`,
})
export class DegreesComponent {
  store = inject(SchoolDegreesStore);
  dialog = inject(Dialog);
  confirmation = inject(ConfirmationService);

  getCurrentPage(pagination: { currentPage: number; start: number }): void {
    const { start } = pagination;
    this.store.setRange(start);
  }

  newDegree() {
    const dialogRef = this.dialog.open<Partial<Degree>>(DegreesFormComponent, {
      minWidth: '36rem',
      disableClose: true,
    });

    dialogRef.closed.subscribe({
      next: (request) => {
        !!request && this.store.saveDegree(request);
      },
    });
  }

  editDegree(degree: Degree) {
    const dialogRef = this.dialog.open<Partial<Degree>>(DegreesFormComponent, {
      minWidth: '36rem',
      disableClose: true,
      data: degree,
    });
    dialogRef.closed.subscribe({
      next: (request) => {
        !!request && this.store.saveDegree({ ...request, id: degree.id });
      },
    });
  }
}
