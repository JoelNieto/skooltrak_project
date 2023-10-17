import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { StudyPlan } from '@skooltrak/models';
import { ButtonDirective, ConfirmationService, PaginatorComponent } from '@skooltrak/ui';

import { StudyPlansFormComponent } from './plans-form.component';
import { SchoolStudyPlansStore } from './plans.store';

@Component({
  selector: 'sk-school-study-plans',
  standalone: true,
  imports: [
    NgIconComponent,
    TranslateModule,
    PaginatorComponent,
    NgFor,
    NgIf,
    DatePipe,
    DialogModule,
    ButtonDirective,
  ],
  providers: [
    provideComponentStore(SchoolStudyPlansStore),
    provideIcons({ heroMagnifyingGlass, heroPencilSquare, heroTrash }),
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
            id="table-search"
            class="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500"
            placeholder="Search for items"
          />
        </div>
      </div>

      <button skButton color="green" (click)="newStudyPlan()">
        {{ 'New' | translate }}
      </button>
    </div>
    <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <thead
        class="bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr class="cursor-pointer">
          <th scope="col" class="px-6 py-3">{{ 'Name' | translate }}</th>
          <th scope="col" class="px-6 py-3">{{ 'Level' | translate }}</th>
          <th scope="col" class="px-6 py-3">{{ 'StudyPlan' | translate }}</th>
          <th score="col" class="px-6 py-3">{{ 'Created' | translate }}</th>
          <th scope="col" class="px-6 py-3 text-center">
            {{ 'Actions' | translate }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          *ngFor="let plan of store.PLANS()"
          [class.hidden]="store.LOADING()"
          class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <th
            scope="row"
            class="whitespace-nowrap px-6 py-2.5 font-medium text-gray-900 dark:text-white"
          >
            {{ plan.name }}
          </th>
          <td class="px-6 py-2.5">{{ plan.level?.name }}</td>
          <td class="px-6 py-2.5">{{ plan.degree?.name }}</td>
          <td class="px-6 py-2.5">{{ plan.created_at | date : 'short' }}</td>
          <td class="flex content-center justify-center gap-2 px-6 py-2.5">
            <button type="button" (click)="editStudyPlan(plan)">
              <ng-icon
                name="heroPencilSquare"
                class="text-green-500"
                size="24"
              />
            </button>
            <button type="button">
              <ng-icon name="heroTrash" class="text-red-600" size="24" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-2 animate-pulse" *ngIf="store.LOADING()">
      <h3 class="h-4 w-10/12 rounded-md bg-gray-200 dark:bg-gray-700"></h3>

      <ul class="mt-5 space-y-3">
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
      </ul>
    </div>

    <sk-paginator
      [count]="store.COUNT()"
      [pageSize]="store.PAGE_SIZE"
      (paginate)="getCurrentPage($event)"
    />
  </div>`,
})
export class StudyPlansComponent {
  public store = inject(SchoolStudyPlansStore);
  private dialog = inject(Dialog);
  private confirmation = inject(ConfirmationService);

  public getCurrentPage(pagination: {
    currentPage: number;
    start: number;
  }): void {
    const { start } = pagination;
    this.store.setRange(start);
  }

  public newStudyPlan(): void {
    const dialogRef = this.dialog.open<Partial<StudyPlan>>(
      StudyPlansFormComponent,
      {
        minWidth: '36rem',
        disableClose: true,
      }
    );

    dialogRef.closed.subscribe({
      next: (request) => {
        !!request && this.store.saveStudyPlan(request);
      },
    });
  }

  public editStudyPlan(degree: StudyPlan): void {
    const dialogRef = this.dialog.open<Partial<StudyPlan>>(
      StudyPlansFormComponent,
      {
        minWidth: '36rem',
        disableClose: true,
        data: degree,
      }
    );
    dialogRef.closed.subscribe({
      next: (request) => {
        !!request && this.store.saveStudyPlan({ ...request, id: degree.id });
      },
    });
  }
}
