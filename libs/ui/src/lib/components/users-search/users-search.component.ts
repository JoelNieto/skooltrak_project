import { IconsModule } from '@amithvns/ng-heroicons';
import { DialogRef } from '@angular/cdk/dialog';
import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { startWith } from 'rxjs';

import { AvatarComponent } from '../avatar/avatar.component';
import { ButtonDirective } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { UsersSearchStore } from './users-search.store';

@Component({
  selector: 'sk-users-search',
  standalone: true,
  imports: [
    CardComponent,
    AvatarComponent,
    ButtonDirective,
    TranslateModule,
    IconsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
  ],
  providers: [provideComponentStore(UsersSearchStore)],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title text-xl text-gray-700 dark:text-gray-100 font-semibold mb-4"
        p
      >
        {{ 'Users search' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <icon name="x-mark" class="text-gray-700 dark:text-gray-100" />
      </button>
    </div>
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
          [formControl]="searchText"
          class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
          placeholder="Search for items"
        />
      </div>
      <div class="flex flex-col my-2">
        <div class="animate-pulse mt-4" *ngIf="store.loading()">
          <h3 class="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-10/12"></h3>
          <ul class="mt-5 space-y-3">
            <li class="w-full h-4 bg-gray-200 rounded-md dark:bg-gray-700"></li>
            <li class="w-full h-4 bg-gray-200 rounded-md dark:bg-gray-700"></li>
            <li class="w-full h-4 bg-gray-200 rounded-md dark:bg-gray-700"></li>
          </ul>
        </div>
        <div
          *ngFor="let user of store.users()"
          class="flex items-center px-3 py-2 gap-2 hover:bg-gray-100 cursor-pointer"
        >
          <div class="basis-1/10 block">
            <sk-avatar
              [rounded]="true"
              class="w-9"
              [avatarUrl]="user.avatar_url!"
            />
          </div>
          <div class="flex flex-col">
            <span class="text-gray-700 text-sm font-title"
              >{{ user.first_name }} {{ user.father_name }}</span
            >
            <span class="text-xs text-gray-400 font-mono">{{
              user.email
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end pt-4" footer>
      <button skButton color="green">{{ 'Confirm' | translate }}</button>
    </div>
  </sk-card>`,
})
export class UserSearchComponent implements OnInit {
  store = inject(UsersSearchStore);
  dialogRef = inject(DialogRef);
  searchText = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    const valueChanges$ = this.searchText.valueChanges.pipe(startWith(''));

    valueChanges$.subscribe({
      next: (value) => this.store.patchState({ currentQuery: value }),
    });
  }
}
