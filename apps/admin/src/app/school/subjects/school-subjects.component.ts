import { IconsModule } from '@amithvns/ng-heroicons';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from '@skooltrak/models';
import {
  ButtonComponent,
  ConfirmationService,
  PaginatorComponent,
  UtilService,
} from '@skooltrak/ui';

import { SubjectsFormComponent } from './form/subjects-forms.component';
import { SchoolSubjectsStore } from './school-subjects.store';

@Component({
  selector: 'skooltrak-school-subjects',
  standalone: true,
  imports: [
    IconsModule,
    NgFor,
    NgIf,
    ButtonComponent,
    PaginatorComponent,
    DialogModule,
    NgClass,
    SubjectsFormComponent,
    DatePipe,
    IconsModule,
    TranslateModule,
  ],
  providers: [
    provideComponentStore(SchoolSubjectsStore),
    UtilService,
    ConfirmationService,
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

      <button skooltrak-button color="green" (click)="newSubject()">
        {{ 'New' | translate }}
      </button>
    </div>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr class="cursor-pointer">
          <th scope="col" class="px-6 py-3">{{ 'Name' | translate }}</th>
          <th scope="col" class="px-6 py-3">{{ 'Short name' | translate }}</th>
          <th scope="col" class="px-6 py-3">{{ 'Code' | translate }}</th>
          <th score="col" class="px-6 py-3">{{ 'Created' | translate }}</th>
          <th score="col" class="px-6 py-3">{{ 'Created by' | translate }}</th>
          <th scope="col" class="px-6 py-3 text-center">
            {{ 'Actions' | translate }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          *ngFor="let subject of store.subjects()"
          [class.hidden]="store.loading()"
          class="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        >
          <th
            scope="row"
            class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ subject.name }}
          </th>
          <td class="px-6 py-2">{{ subject.short_name }}</td>
          <td class="px-6 py-2">{{ subject.code }}</td>
          <td class="px-6 py-2">{{ subject.created_at | date : 'medium' }}</td>
          <td class="px-6 py-2">{{ subject.user?.full_name }}</td>
          <td class="px-6 py-2 flex justify-center gap-2 content-center">
            <button type="button" (click)="editSubject(subject)">
              <icon name="pencil-square" class="h-6 w-6 text-green-500" />
            </button>
            <button type="button" (click)="deleteSubject()">
              <icon name="trash" class="h-6 w-6 text-red-400" />
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
export class SchoolSubjectsComponent {
  @ViewChild(PaginatorComponent) paginator!: PaginatorComponent;
  store = inject(SchoolSubjectsStore);
  dialog = inject(Dialog);
  confirmation = inject(ConfirmationService);
  getCurrentPage(pagination: { currentPage: number; start: number }): void {
    const { start } = pagination;
    this.store.setRange(start);
  }

  newSubject() {
    const dialogRef = this.dialog.open<Partial<Subject>>(
      SubjectsFormComponent,
      {
        minWidth: '36rem',
        disableClose: true,
      }
    );

    dialogRef.closed.subscribe({
      next: (request) => {
        !!request && this.store.saveSubject(request);
      },
    });
  }

  editSubject(subject: Subject) {
    const dialogRef = this.dialog.open<Partial<Subject>>(
      SubjectsFormComponent,
      {
        minWidth: '36rem',
        disableClose: true,
        data: subject,
      }
    );
    dialogRef.closed.subscribe({
      next: (request) => {
        !!request && this.store.saveSubject({ ...request, id: subject.id });
      },
    });
  }

  deleteSubject() {
    this.confirmation.openDialog('delete').subscribe();
  }
}
