import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe, NgClass } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroMagnifyingGlass,
  heroPencilSquare,
  heroTrash,
} from '@ng-icons/heroicons/outline';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from '@skooltrak/models';
import {
  ButtonDirective,
  ConfirmationService,
  EmptyTableComponent,
  LoadingComponent,
  PaginatorComponent,
} from '@skooltrak/ui';
import { debounceTime } from 'rxjs';

import { SubjectsFormComponent } from './subjects-form.component';
import { SchoolSubjectsStore } from './subjects.store';

@Component({
  selector: 'sk-school-subjects',
  standalone: true,
  imports: [
    ButtonDirective,
    PaginatorComponent,
    DialogModule,
    NgClass,
    SubjectsFormComponent,
    DatePipe,
    NgIconComponent,
    TranslateModule,
    ReactiveFormsModule,
    LoadingComponent,
    EmptyTableComponent,
  ],
  providers: [
    provideIcons({ heroMagnifyingGlass, heroPencilSquare, heroTrash }),
    SchoolSubjectsStore,
    ConfirmationService,
  ],
  template: `<div class="relative overflow-x-auto">
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
            [formControl]="textSearch"
            class="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500"
            [placeholder]="'SEARCH_ITEMS' | translate"
          />
        </div>
      </div>

      <button skButton color="green" (click)="newSubject()">
        {{ 'NEW' | translate }}
      </button>
    </div>
    <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <thead
        class="bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr class="cursor-pointer">
          <th scope="col" class="px-6 py-3">{{ 'NAME' | translate }}</th>
          <th scope="col" class="px-6 py-3">{{ 'SHORT_NAME' | translate }}</th>
          <th scope="col" class="px-6 py-3">{{ 'CODE' | translate }}</th>
          <th score="col" class="px-6 py-3">{{ 'CREATED' | translate }}</th>
          <th scope="col" class="px-6 py-3 text-center">
            {{ 'ACTIONS' | translate }}
          </th>
        </tr>
      </thead>
      <tbody>
        @if (store.loading()) {
          <tr sk-loading></tr>
        } @else {
          @for (subject of store.subjects(); track subject.id) {
            <tr
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
              <td class="px-6 py-4">
                {{ subject.created_at | date: 'short' }}
              </td>
              <td class="flex content-center justify-center gap-2 px-6 py-4">
                <button type="button" (click)="editSubject(subject)">
                  <ng-icon
                    name="heroPencilSquare"
                    class="text-green-500"
                    size="24"
                  />
                </button>
                <button type="button" (click)="deleteSubject(subject)">
                  <ng-icon name="heroTrash" class="text-red-600" size="24" />
                </button>
              </td>
            </tr>
          } @empty {
            <tr sk-empty></tr>
          }
        }
      </tbody>
    </table>
    <sk-paginator
      [count]="store.count()"
      [pageSize]="store.pageSize()"
      (paginate)="getCurrentPage($event)"
    />
  </div>`,
})
export class SchoolSubjectsComponent implements OnInit {
  public store = inject(SchoolSubjectsStore);
  private dialog = inject(Dialog);
  private confirmation = inject(ConfirmationService);
  private destroy = inject(DestroyRef);

  public textSearch = new FormControl('', { nonNullable: true });

  public ngOnInit(): void {
    this.textSearch.valueChanges
      .pipe(debounceTime(800), takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (queryText) => patchState(this.store, { queryText }),
      });
  }

  public getCurrentPage(pagination: {
    currentPage: number;
    start: number;
    pageSize: number;
  }): void {
    const { start, pageSize } = pagination;
    patchState(this.store, { start, pageSize });
  }

  public newSubject(): void {
    const dialogRef = this.dialog.open<Partial<Subject>>(
      SubjectsFormComponent,
      {
        minWidth: '36rem',
        disableClose: true,
      },
    );
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (request) => {
        !!request && this.store.saveSubject(request);
      },
    });
  }

  public editSubject(subject: Subject): void {
    const dialogRef = this.dialog.open<Partial<Subject>>(
      SubjectsFormComponent,
      {
        minWidth: '36rem',
        disableClose: true,
        data: subject,
      },
    );
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (request) => {
        !!request && this.store.saveSubject({ ...request, id: subject.id });
      },
    });
  }

  public deleteSubject(subject: Subject): void {
    const { id } = subject;
    if (!id) return;
    this.confirmation
      .openDialog({
        title: 'CONFIRMATION.DELETE.TITLE',
        description: 'CONFIRMATION.DELETE.TEXT',
        icon: 'heroTrash',
        color: 'red',
        confirmButtonText: 'CONFIRMATION.DELETE.CONFIRM',
        cancelButtonText: 'CONFIRMATION.DELETE.CANCEL',
        showCancelButton: true,
      })
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          !!res && this.store.deleteSubject(id);
        },
      });
  }
}
