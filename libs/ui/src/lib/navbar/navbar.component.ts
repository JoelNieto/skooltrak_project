import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentRole, selectUser } from 'libs/auth/src/lib/state/selectors';

@Component({
  selector: 'skooltrak-navbar',
  standalone: true,
  imports: [CommonModule, CdkMenuModule],
  template: `<nav
    class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start">
          <button
            data-drawer-target="logo-sidebar"
            data-drawer-toggle="logo-sidebar"
            aria-controls="logo-sidebar"
            type="button"
            class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
              src="assets/skooltrak-logo.svg"
              class="h-8 mr-3"
              alt="Skooltrak Logo"
            />
            <span
              class="self-center text-gray-700 text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white"
              >Skooltrak</span
            >
          </a>
        </div>
        <div class="flex items-center">
          <div class="flex items-center ml-3">
            <div>
              <button
                type="button"
                class="flex items-center p-1 justify-center text-sm rounded gap-2 focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-600"
                [cdkMenuTriggerFor]="menu"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="w-7 h-7 border-none dark:bg-gray-800"
                  src="assets/bot-avatar.png"
                  alt="user photo"
                />
                <div class="flex flex-col items-start">
                  <p
                    class="text-xs text-gray-800 dark:text-white font-semibold"
                  >
                    {{ user()?.full_name }}
                  </p>
                  <p class="text-xs text-gray-400 font-mono">
                    {{ role()?.role?.name }}
                  </p>
                </div>
              </button>
            </div>
            <ng-template #menu>
              <div
                class="my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                id="dropdown-user"
                cdkMenu
              >
                <div class="px-4 py-3" role="none">
                  <p
                    class="text-sm text-sky-700 font-bold dark:text-white"
                    role="none"
                  >
                    {{ user()?.full_name }}
                  </p>
                  <p
                    class="text-sm text-gray-500 truncate dark:text-gray-300"
                    role="none"
                  >
                    {{ user()?.email }}
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
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  </nav>`,
  styles: [],
})
export class NavbarComponent {
  store = inject(Store);
  user = this.store.selectSignal(selectUser);
  role = this.store.selectSignal(selectCurrentRole);
}
