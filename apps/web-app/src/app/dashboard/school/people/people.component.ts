import { Dialog } from '@angular/cdk/dialog';
import { DatePipe, JsonPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroPencilSquare } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { RoleEnum, SchoolProfile, StatusEnum } from '@skooltrak/models';
import { PaginatorComponent } from '@skooltrak/ui';

import { AvatarComponent } from '../../../components/avatar/avatar.component';
import { UserChipComponent } from '../../../components/user-chip/user-chip.component';
import { SchoolPeopleFormComponent } from './people-form.component';
import { SchoolPeopleStore } from './people.store';

@Component({
  standalone: true,
  selector: 'sk-school-people',
  imports: [
    TranslateModule,
    NgIconComponent,
    ReactiveFormsModule,
    PaginatorComponent,
    UserChipComponent,
    RouterLink,
    DatePipe,
    JsonPipe,
    AvatarComponent,
  ],
  providers: [
    provideComponentStore(SchoolPeopleStore),
    provideIcons({ heroMagnifyingGlass, heroPencilSquare }),
  ],
  styles: [
    `
      input,
      select,
      textarea {
        @apply block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm;
        &.ng-invalid.ng-dirty {
          @apply border-red-400 bg-red-100 text-red-800 focus:border-red-600 focus:ring-red-600;
        }
      }

      label {
        @apply mb-2 block font-sans text-sm font-medium text-gray-600 dark:text-white;
      }
    `,
  ],
  template: `<div class="relative overflow-x-auto">
    <div class="mb-4 flex justify-between gap-4 p-1">
      <div class="flex-1">
        <select [formControl]="roleControl">
          <option value="all">{{ 'PEOPLE.ALL_ROLES' | translate }}</option>
          @for(role of roles; track role) {
            <option [value]="role">
              {{ 'PEOPLE.' + role | translate }}
            </option>
          }
        </select>
      </div>
      <div class="flex-1">
        <select [formControl]="statusControl">
          <option value="all">{{ 'PEOPLE.ALL_STATUS' | translate }}</option>
          @for(status of statuses; track status) {
            <option [value]="status">
            {{ 'PEOPLE.' + status | translate }}
          </option>
          }
        </select>
      </div>
      <div class="flex-1">
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
              class="pl-10"
              [placeholder]="'SEARCH_ITEMS' | translate"
            />
          </div>
        </div>
      </div>
    </div>
    <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <thead
        class="bg-gray-100 font-sans text-xs font-semibold uppercase text-gray-700 dark:bg-gray-600 dark:text-gray-200"
      >
        <tr class="cursor-pointer">
          <th scope="col" class="flex items-center gap-3 px-6 py-3">
            {{ 'USER' | translate }}
          </th>
          <th scope="col" class="px-6 py-3">{{ 'DOCUMENT_ID' | translate }}</th>
          <th scope="col" class="px-6 py-3">{{ 'ROLE' | translate }}</th>
          <th scope="col" class="px-6 py-3">
            {{ 'STATUS' | translate }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ 'CREATED_AT' | translate }}
          </th>
          <th scope="col" class="px-6 py-3 text-center">
            {{ 'ACTIONS' | translate }}
          </th>
        </tr>
      </thead>
      <tbody>
        @for(person of store.PEOPLE(); track person.user_id) {
          <tr
          [class.hidden]="store.LOADING()"
          class="border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700"
        >
          <th
            scope="row"
            class="whitespace-nowrap px-6 py-3.5 font-medium text-gray-900 dark:text-white"
          >
            <div class="flex items-center gap-2">
              <sk-avatar
                [avatarUrl]="person.user.avatar_url ?? 'default_avatar.jpg'"
                class="h-10"
                [rounded]="true"
              />
              <div class="flex flex-col">
                <div class="text-base text-gray-700 dark:text-gray-200">
                  {{ person.user.first_name }} {{ person.user.father_name }}
                </div>
                <div class="font-mono text-sm text-gray-400">
                  {{ person.user.email }}
                </div>
              </div>
            </div>
          </th>
          <td class="px-6 py-3.5">{{ person.user.document_id }}</td>
          <td class="px-6 py-3.5">{{ person.role | translate }}</td>
          <td class="px-6 py-3.5">{{ person.status | translate }}</td>
          <td class="px-6 py-3.5">
            {{ person.created_at | date : 'medium' }}
          </td>
          <td class="flex content-center justify-center gap-2 px-6 py-3.5">
            <button type="button" (click)="editPeople(person)">
              <ng-icon
                name="heroPencilSquare"
                class="text-green-500"
                size="24"
              />
            </button>
          </td>
        </tr>
        }
      </tbody>
    </table>
    @if(store.LOADING()) {
      <div class="mt-4 animate-pulse">
      <h3 class="h-4 w-10/12 rounded-md bg-gray-200 dark:bg-gray-700"></h3>
      <ul class="mt-8 space-y-8">
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        <li class="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
      </ul>
    </div>
    }
    @if(!store.LOADING() && !store.PEOPLE().length){
      <div
      class="flex items-center justify-center"
      >
      <img src="/assets/images/teacher.svg" alt="" />
    </div>
    }

  </div>`,
})
export class SchoolPeopleComponent implements OnInit {
  public roles = Object.values(RoleEnum);
  public statuses = Object.values(StatusEnum);
  private destroy = inject(DestroyRef);
  private dialog = inject(Dialog);
  public roleControl = new FormControl<'all' | RoleEnum>('all', {
    nonNullable: true,
  });

  public statusControl = new FormControl<'all' | StatusEnum>('all', {
    nonNullable: true,
  });
  public store = inject(SchoolPeopleStore);

  public ngOnInit(): void {
    this.roleControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (role) => {
          this.store.patchState({ SELECTED_ROLE: role });
        },
      });

    this.statusControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (status) => {
          this.store.patchState({ SELECTED_STATUS: status });
        },
      });
  }

  public editPeople(person: SchoolProfile): void {
    const dialogRef = this.dialog.open(SchoolPeopleFormComponent, {
      width: '34rem',
      maxWidth: '90%',
      data: person,
    });
    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({ next: () => this.store.fetchPeople() });
  }
}
