import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBookmarkSquare,
  heroCalendarDays,
  heroClipboardDocument,
  heroHome,
} from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { authState } from '@skooltrak/auth';

import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'sk-navbar',
  standalone: true,
  imports: [
    CommonModule,
    CdkMenuModule,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    AvatarComponent,
    NgIconComponent,
  ],
  providers: [
    provideIcons({
      heroHome,
      heroBookmarkSquare,
      heroClipboardDocument,
      heroCalendarDays,
    }),
  ],
  template: `<nav class="fixed top-0 z-50 w-full bg-white dark:bg-gray-800">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start">
          <button
            type="button"
            class="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
          >
            <span class="sr-only">Open sidebar</span>
            <svg
              class="h-6 w-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              ></path>
            </svg>
          </button>
          <a routerLink="home" class="ml-2 flex md:mr-24">
            <img
              src="assets/skooltrak-logo.svg"
              class="mr-2 h-7"
              alt="Skooltrak Logo"
            />
            <span
              class="font-title self-center whitespace-nowrap text-xl font-semibold text-gray-700 dark:text-white"
              >{{ 'App title' | translate }}</span
            >
          </a>
        </div>
        <div class="hidden w-full md:block md:w-auto">
          <ul
            class="mt-4 flex flex-col rounded-xl border border-gray-100 p-4 dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:items-center md:space-x-4 md:border-0 md:p-0"
          >
            <li>
              <a routerLink="home" class="link" routerLinkActive="active"
                ><ng-icon name="heroHome" size="24" />Home</a
              >
            </li>
            <li>
              <a routerLink="courses" class="link" routerLinkActive="active"
                ><ng-icon name="heroBookmarkSquare" size="24" />Courses</a
              >
            </li>
            <li>
              <a routerLink="grades" class="link" routerLinkActive="active"
                ><ng-icon name="heroClipboardDocument" size="24" />Grades</a
              >
            </li>
            <li>
              <a href="#" class="link"
                ><ng-icon name="heroCalendarDays" size="24" />Schedules</a
              >
            </li>
          </ul>
        </div>
        <div class="flex items-center">
          <div class="ml-3 flex items-center">
            <div>
              <button
                type="button"
                class="flex items-center justify-center gap-2 rounded p-1 text-sm"
                [cdkMenuTriggerFor]="menu"
              >
                <span class="sr-only">Open user menu</span>
                <sk-avatar
                  [avatarUrl]="user()?.avatar_url ?? 'default_avatar.jpg'"
                  [rounded]="true"
                  class="w-8"
                />

                <div class="flex flex-col items-start">
                  <p
                    class="font-sans text-sm font-semibold text-gray-800 dark:text-white"
                  >
                    {{ user()?.first_name }} {{ user()?.father_name }}
                  </p>
                  <p class="font-title text-xs text-gray-400">
                    {{ role()?.role }}
                  </p>
                </div>
              </button>
            </div>
            <ng-template #menu>
              <div
                class="my-4 list-none divide-y divide-gray-100 rounded bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700"
                id="dropdown-user"
                cdkMenu
              >
                <div class="px-4 py-3" role="none">
                  <p
                    class="text-sm font-bold text-sky-700 dark:text-white"
                    role="none"
                  >
                    {{ user()?.first_name }} {{ user()?.father_name }}
                  </p>
                  <p
                    class="truncate font-sans text-sm text-gray-500 dark:text-gray-300"
                    role="none"
                  >
                    {{ user()?.email }}
                  </p>
                </div>
                <ul class="py-1" role="none">
                  <li>
                    <a
                      routerLink="profile"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      cdkMenuItem
                      >Profile</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      cdkMenuItem
                      >Settings</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      cdkMenuItem
                      >Earnings</a
                    >
                  </li>
                  <li>
                    <a href="#" class="menu-item" cdkMenuItem>Sign out</a>
                  </li>
                </ul>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  </nav>`,
  styles: [
    `
      .menu-item {
        @apply block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white;
      }
      .link {
        @apply flex gap-2 px-4 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-sky-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500;
        &.active {
          @apply flex gap-2 rounded-lg bg-sky-200 px-4 py-2  font-semibold text-sky-700;
        }
      }
    `,
  ],
})
export class NavbarComponent {
  private auth = inject(authState.AuthStateFacade);
  user = this.auth.user;
  role = this.auth.currentRole;
}
