import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { StudyPlan } from '@skooltrak/models';
import {
  ButtonDirective,
  ConfirmationService,
  EmptyTableComponent,
  LoadingComponent,
  PaginatorComponent,
} from '@skooltrak/ui';

import { StudyPlansFormComponent } from './plans-form.component';
import { SchoolStudyPlansStore } from './plans.store';

@Component({
  selector: 'sk-school-study-plans',
  standalone: true,
  imports: [
    NgIconComponent,
    TranslateModule,
    PaginatorComponent,
    DatePipe,
    DialogModule,
    ButtonDirective,
    LoadingComponent,
    EmptyTableComponent,
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
        {{ 'NEW' | translate }}
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
        @if(store.LOADING()) {
        <tr sk-loading></tr>
        } @else { @for(plan of store.PLANS(); track plan.id) {
        <tr
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
          <td class="px-6 py-2.5">{{ plan.created_at | date: 'short' }}</td>
          <td class="flex content-center justify-center gap-2 px-6 py-2.5">
            <button type="button" (click)="editStudyPlan(plan)">
              <ng-icon
                name="heroPencilSquare"
                class="text-green-500"
                size="24"
              />
            </button>
            <button type="button" (click)="deletePlan(plan)">
              <ng-icon name="heroTrash" class="text-red-600" size="24" />
            </button>
          </td>
        </tr>
        } @empty {
        <tr sk-empty></tr>
        } }
      </tbody>
    </table>
    <sk-paginator
      [count]="store.COUNT()"
      [pageSize]="store.PAGE_SIZE()"
      (paginate)="getCurrentPage($event)"
    />
  </div>`,
})
export class StudyPlansComponent {
  public store = inject(SchoolStudyPlansStore);
  private dialog = inject(Dialog);
  private confirmation = inject(ConfirmationService);
  private destroy = inject(DestroyRef);

  public getCurrentPage(pagination: {
    currentPage: number;
    start: number;
    pageSize: number;
  }): void {
    const { start, pageSize } = pagination;
    this.store.patchState({ START: start, PAGE_SIZE: pageSize });
  }

  public newStudyPlan(): void {
    const dialogRef = this.dialog.open<Partial<StudyPlan>>(
      StudyPlansFormComponent,
      {
        minWidth: '36rem',
        disableClose: true,
      },
    );

    dialogRef.closed.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (request) => {
        !!request && this.store.saveStudyPlan(request);
      },
    });
  }

  public editStudyPlan(plan: StudyPlan): void {
    const dialogRef = this.dialog.open<Partial<StudyPlan>>(
      StudyPlansFormComponent,
      {
        minWidth: '36rem',
        disableClose: true,
        data: plan,
      },
    );
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (request) => {
        !!request && this.store.saveStudyPlan({ ...request, id: plan.id });
      },
    });
  }

  public deletePlan(plan: StudyPlan): void {
    const { id } = plan;
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
        next: (res) => !!res && this.store.deletePlan(id),
      });
  }
}
