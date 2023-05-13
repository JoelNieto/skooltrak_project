import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';
import { LetDirective } from '@ngrx/component';

import { SchoolsStore } from '../schools.store';

@Component({
  selector: 'skooltrak-schools-details',
  standalone: true,
  imports: [
    LetDirective,
    RouterLink,
    NgHeroiconsModule,
    MatTabsModule,
    NgIf,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  template: `
    <div
      *ngIf="school() as school"
      class="rounded-lg p-2 flex flex-col gap-2 items-center bg-white dark:bg-gray-700 dark:border-none"
    >
      <img [src]="school?.logo_url" class="h-24 max-w-full mb-2" alt="" />
      <h2 class="text-2xl font-bold font-mono text-gray-700 dark:text-gray-100">
        {{ school?.full_name }}
      </h2>
      <a
        routerLink="../edit"
        [queryParams]="{ id: school?.id }"
        class=" text-green-600"
      >
        Edit
      </a>

      <div
        class="text-sm font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700 w-full"
      >
        <ul class="flex flex-wrap -mb-px">
          <li class="mr-2">
            <a
              routerLink="admins"
              routerLinkActive="active"
              class="inline-block px-4 py-2  border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              >Admin</a
            >
          </li>
          <li class="mr-2">
            <a
              href="#"
              class="inline-block px-4 py-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              aria-current="page"
              >Students</a
            >
          </li>
          <li class="mr-2">
            <a
              href="#"
              class="inline-block px-4 py-2  border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              >Settings</a
            >
          </li>
          <li class="mr-2">
            <a
              href="#"
              class="inline-block px-4 py-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              >Contacts</a
            >
          </li>
          <li>
            <a
              class="inline-block px-4 py-2  text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500"
              >Disabled</a
            >
          </li>
        </ul>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
      .active {
        @apply text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500;
      }
    `,
  ],
})
export class SchoolsDetailsComponent implements OnInit {
  private store = inject(SchoolsStore);
  private route = inject(ActivatedRoute);
  public school = this.store.selected;

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: ({ id }) => !!id && this.store.setSelected(id),
    });
  }
}
