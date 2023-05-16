import { IconsModule } from '@amithvns/ng-heroicons';
import { NgFor, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';
import { SupabaseService } from '@skooltrak/auth';
import { from } from 'rxjs';

@Component({
  selector: 'skooltrak-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
    NgHeroiconsModule,
    IconsModule,
    NgFor,
    NgForOf,
  ],
  template: `
    <nav
      class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-700 dark:border-gray-800 sm:hidden "
    >
      <div class="px-3 py-3 lg:px-5 lg:pl-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center justify-start">
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span class="sr-only">Open sidebar</span>
              <svg
                class="w-6 h-6"
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
            <a href="https://flowbite.com" class="flex ml-2 md:mr-24">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                class="h-8 mr-3"
                alt="FlowBite Logo"
              />
              <span
                class="self-center text-xl font-semibold text-gray-700 sm:text-2xl whitespace-nowrap dark:text-white"
                >Flowbite</span
              >
            </a>
          </div>
        </div>
      </div>
    </nav>
    <aside
      id="logo-sidebar"
      class="bg-sky-600 dark:bg-gray-700 mt-12 sm:mt-0 pt-4 fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 flex flex-col"
    >
      <div class="flex flex-col p-3">
        <div class="flex items-center mb-4">
          <div class="flex items-center">
            <div class="flex gap-4">
              <button
                type="button"
                class="flex items-center content-center gap-2 rounded-full"
                aria-expanded="false"
                data-dropdown-toggle="dropdown-user"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="w-8 h-8 rounded-full"
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="user photo"
                />
                <div class="flex flex-col items-start">
                  <span class="text-white">{{ profile()?.full_name }}</span>
                  <span class="text-white font-mono text-xs truncate">{{
                    profile()?.email
                  }}</span>
                </div>
              </button>
            </div>
            <div
              class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 left-5 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
              id="dropdown-user"
            >
              <div class="px-4 py-3" role="none">
                <p class="text-sm text-gray-900 dark:text-white" role="none">
                  {{ profile()?.full_name }}
                </p>
                <p
                  class="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                  role="none"
                >
                  {{ profile()?.email }}
                </p>
              </div>
              <ul class="py-1" role="none">
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                    >Dashboard</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                    >Settings</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                    >Earnings</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                    >Sign out</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <ul role="list" class="flex flex-col gap-1 mt-4">
          <li *ngFor="let link of links()">
            <a
              routerLinkActive="active"
              [routerLink]="link['route']"
              class="link"
            >
              <icon [name]="link['icon']" class="w-6 h-6" />
              {{ link['name'] }}
            </a>
          </li>
        </ul>
      </div>
    </aside>
    <main class="p-8 mt-14 sm:ml-64 bg-white dark:bg-gray-800">
      <ng-content select="[content]"></ng-content>
    </main>
  `,
  styles: [
    `
      .link {
        @apply text-gray-100 dark:text-gray-100 flex items-center rounded-lg gap-3 hover:text-blue-200 p-2 cursor-pointer font-mono;
      }

      .active {
        @apply text-blue-500 bg-white  dark:bg-gray-700 dark:text-sky-100 font-semibold;
      }

      main {
        min-height: calc(100vh - 3.5rem);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public supabase = inject(SupabaseService);

  request = toSignal(from(this.supabase.profile()));
  access = toSignal(from(this.supabase.access()));
  profile = computed(() => this.request()?.data);
  links = computed(() => this.access()?.data);
}
