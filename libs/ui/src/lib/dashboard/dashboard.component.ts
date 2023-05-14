import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';
import { SupabaseService } from '@skooltrak/auth';
import { from } from 'rxjs';

@Component({
  selector: 'skooltrak-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink, NgHeroiconsModule],
  template: `
    <nav
      class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-700 dark:border-gray-800"
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
                class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white"
                >Flowbite</span
              >
            </a>
          </div>
          <div class="flex items-center">
            <div class="flex items-center ml-3">
              <div>
                <button
                  type="button"
                  class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded="false"
                  data-dropdown-toggle="dropdown-user"
                >
                  <span class="sr-only">Open user menu</span>
                  <img
                    class="w-8 h-8 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="user photo"
                  />
                </button>
              </div>
              <div
                class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
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
                    neil.sims@flowbite.com
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
        </div>
      </div>
    </nav>
    <aside
      id="logo-sidebar"
      class="bg-gray-50 dark:bg-gray-700 fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 flex flex-col"
    >
      <div class="flex flex-col p-3">
        <a
          href="#"
          class="flex block items-center font-sans text-xl font-semibold mb-6 text-gray-200 dark:text-white"
        >
          <img
            class="w-10 h-10 mr-2"
            src="https://www.skooltrak.com/assets/img/logo.png"
            alt="logo"
          />
        </a>
        <ul role="list" class="flex flex-col gap-1">
          <li>
            <a routerLinkActive="active" routerLink="home" class="link" rou>
              <home-outline-icon class="w-6 h-6" />
              Home
            </a>
          </li>
          <li>
            <a routerLinkActive="active" routerLink="schools" class="link">
              <building-office-outline-icon class="w-6 h-6" />
              Schools
            </a>
          </li>
          <li>
            <a routerLinkActive="active" routerLink="subjects" class="link">
              <bookmark-square-outline-icon class="w-6 h-6" />
              Subjects
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
        @apply text-gray-500 dark:text-gray-100 flex items-center rounded-lg gap-3 hover:text-blue-600 p-2 cursor-pointer font-mono;
      }

      .active {
        @apply text-blue-600 bg-blue-200 bg-opacity-50 dark:bg-gray-700 dark:text-sky-100 font-semibold;
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
  profile = computed(() => this.request()?.data);
}
