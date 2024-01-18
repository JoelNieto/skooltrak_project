import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroMagnifyingGlass,
  heroPencilSquare,
  heroTrash,
} from '@ng-icons/heroicons/outline';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { ClassGroup } from '@skooltrak/models';
import {
  ButtonDirective,
  CardComponent,
  EmptyTableComponent,
  LoadingComponent,
  PaginatorComponent,
} from '@skooltrak/ui';

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
    PaginatorComponent,
    ButtonDirective,
    DatePipe,
    UserChipComponent,
    DialogModule,
    LoadingComponent,
    EmptyTableComponent,
  ],
  providers: [
    provideIcons({ heroMagnifyingGlass, heroPencilSquare, heroTrash }),
    SchoolGroupsStore,
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
          {{ 'NEW' | translate }}
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
          @if (store.loading()) {
            <tr sk-loading></tr>
          } @else {
            @for (group of store.groups(); track group.id) {
              <tr
                [class.hidden]="store.loading()"
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
                  @for (teacher of group.teachers; track teacher.id) {
                    <sk-user-chip [user]="teacher" />
                  }
                </td>
                <td class="px-6 py-2">{{ group.degree.name }}</td>
                <td class="px-6 py-2">
                  {{ group.created_at | date: 'medium' }}
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
            } @empty {
              <tr sk-empty></tr>
            }
          }
        </tbody>
      </table>
      <sk-paginator
        [count]="store.count()"
        (paginate)="getCurrentPage($event)"
      />
    </div>
  `,
})
export class SchoolGroupsComponent {
  public store = inject(SchoolGroupsStore);
  private dialog = inject(Dialog);
  private destroy = inject(DestroyRef);

  public getCurrentPage(pagination: { pageSize: number; start: number }): void {
    const { start, pageSize } = pagination;
    patchState(this.store, { pageSize, start });
  }

  public newGroup(): void {
    const dialogRef = this.dialog.open<Partial<ClassGroup>>(
      SchoolGroupsFormComponent,
      {
        minWidth: '36rem',
        maxWidth: '55%',
        disableClose: true,
      },
    );
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (request) => {
        !!request && this.store.saveGroup(request);
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
      },
    );
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (request) => {
        !!request && this.store.saveGroup({ ...request, id: group.id });
      },
    });
  }
}
