import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { ClassGroup } from '@skooltrak/models';
import { ButtonDirective, CardComponent, PaginatorComponent } from '@skooltrak/ui';

import { UserChipComponent } from '../../../components/user-chip/user-chip.component';
import { SchoolGroupsFormComponent } from './groups-form.component';
import { SchoolGroupsStore } from './groups.store';

@Component({
  selector: 'sk-admin-groups-list',
  standalone: true,
  imports: [
    TranslateModule,
    CardComponent,
    NgIconComponent,
    NgFor,
    PaginatorComponent,
    ButtonDirective,
    DatePipe,
    NgIf,
    UserChipComponent,
    DialogModule,
  ],
  providers: [
    provideIcons({ heroMagnifyingGlass, heroPencilSquare, heroTrash }),
    provideComponentStore(SchoolGroupsStore),
  ],
  template: `
    <div class="relative overflow-x-auto">
      <div class="mb-2 flex justify-between px-1 py-2">
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

        <button skButton color="green" (click)="newGroup()">
          {{ 'New' | translate }}
        </button>
      </div>
      <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead
          class="bg-gray-100 font-sans text-xs uppercase text-gray-700 dark:bg-gray-600 dark:text-gray-200"
        >
          <tr class="cursor-pointer">
            <th scope="col" class="px-6 py-3">{{ 'Name' | translate }}</th>
            <th scope="col" class="px-6 py-3">{{ 'Plan' | translate }}</th>
            <th scope="col" class="px-6 py-3">
              {{ 'Teachers' | translate }}
            </th>
            <th scope="col" class="px-6 py-3">
              {{ 'Degree' | translate }}
            </th>
            <th score="col" class="px-6 py-3">{{ 'Created' | translate }}</th>
            <th scope="col" class="px-6 py-3 text-center">
              {{ 'Actions' | translate }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            *ngFor="let group of store.GROUPS()"
            [class.hidden]="store.LOADING()"
            class="border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700"
          >
            <th
              scope="row"
              class="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white"
            >
              {{ group.name }}
            </th>
            <td class="px-6 py-2">{{ group.plan?.name }}</td>
            <td class="flex px-6 py-2">
              <sk-user-chip
                *ngFor="let teacher of group.teachers"
                [user]="teacher"
              />
            </td>
            <td class="px-6 py-2">{{ group.degree.name }}</td>
            <td class="px-6 py-2">
              {{ group.created_at | date : 'medium' }}
            </td>
            <td class="flex items-center justify-center gap-2 px-6 py-4">
              <button type="button" (click)="editGroup(group)">
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
      <div class="mt-4 animate-pulse" *ngIf="store.LOADING()">
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
        [pageSize]="store.PAGE_SIZE()"
        (paginate)="getCurrentPage($event)"
      />
    </div>
  `,
})
export class SchoolGroupsComponent {
  public store = inject(SchoolGroupsStore);
  private dialog = inject(Dialog);
  private destroy = inject(DestroyRef);

  public getCurrentPage(pagination: {
    currentPage: number;
    start: number;
  }): void {
    const { start } = pagination;
    this.store.setRange(start);
  }

  public newGroup(): void {
    const dialogRef = this.dialog.open<Partial<ClassGroup>>(
      SchoolGroupsFormComponent,
      {
        minWidth: '36rem',
        maxWidth: '55%',
        disableClose: true,
      }
    );
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (request) => {
        !!request && this.store.saveClassGroup(request);
      },
    });
  }

  public editGroup(group: ClassGroup): void {
    const dialogRef = this.dialog.open<Partial<ClassGroup>>(
      SchoolGroupsFormComponent,
      {
        minWidth: '36rem',
        maxWidth: '55%',
        disableClose: true,
        data: group,
      }
    );
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (request) => {
        !!request && this.store.saveClassGroup({ ...request, id: group.id });
      },
    });
  }
}
