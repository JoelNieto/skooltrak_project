import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from '@skooltrak/models';
import { ButtonDirective, ConfirmationService, PaginatorComponent } from '@skooltrak/ui';

import { SubjectsFormComponent } from './form/subjects-forms.component';
import { SchoolSubjectsStore } from './school-subjects.store';

@Component({
  selector: 'sk-admin-school-subjects',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ButtonDirective,
    PaginatorComponent,
    DialogModule,
    NgClass,
    SubjectsFormComponent,
    DatePipe,
    NgIconComponent,
    TranslateModule,
  ],
  providers: [
    provideComponentStore(SchoolSubjectsStore),
    provideIcons({ heroMagnifyingGlass, heroPencilSquare, heroTrash }),
    ConfirmationService,
  ],
  template: `<div class="relative mt-1 overflow-x-auto">
    <div class="mb-4 flex justify-between px-1 py-4">
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
            class="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500"
            placeholder="Search for items"
          />
        </div>
      </div>

      <button skButton color="green" (click)="newSubject()">
        {{ 'New' | translate }}
      </button>
    </div>
    <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <thead
        class="bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
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
          class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <th
            scope="row"
            class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
          >
            {{ subject.name }}
          </th>
          <td class="px-6 py-4">{{ subject.short_name }}</td>
          <td class="px-6 py-4">{{ subject.code }}</td>
          <td class="px-6 py-4">{{ subject.created_at | date : 'short' }}</td>
          <td class="px-6 py-4">{{ subject.user?.full_name }}</td>
          <td class="flex content-center justify-center gap-2 px-6 py-4">
            <button type="button" (click)="editSubject(subject)">
              <ng-icon name="heroPencilSquare" class="text-green-500" />
            </button>
            <button type="button" (click)="deleteSubject()">
              <ng-icon name="heroTrash" class="text-red-400" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-2 animate-pulse" *ngIf="store.loading()">
      <h3 class="h-4 w-10/12 rounded-md bg-gray-200 dark:bg-gray-700"></h3>

      <ul class="mt-5 space-y-3">
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
      </ul>
    </div>

    <sk-paginator
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
