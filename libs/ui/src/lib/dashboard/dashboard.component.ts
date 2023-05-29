import { IconsModule } from '@amithvns/ng-heroicons';
import { JsonPipe, NgFor, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { state } from '@skooltrak/auth';

import { AvatarComponent } from '../avatar/avatar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'skooltrak-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
    AvatarComponent,
    IconsModule,
    JsonPipe,
    NgFor,
    NgIf,
    NgForOf,
    NavbarComponent,
  ],
  template: `
    <skooltrak-navbar />
    <aside
      id="logo-sidebar"
      class="bg-white mt-14 dark:bg-gray-800 mt-12 border-r border-gray-200 dark:border-gray-700 pt-4 fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 flex flex-col"
    >
      <div class="flex flex-col p-3">
        <div class="flex items-center justify-center mb-2">
          <div class="flex items-center truncate">
            <div class="flex pl-2">
              <button
                type="button"
                class="flex flex-col justify-center items-center content-center gap-1 rounded-lg"
                aria-expanded="false"
                data-dropdown-toggle="dropdown-user"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  *ngIf="!role()?.school?.crest_url"
                  class="h-12"
                  src="https://ibepanama.org/wp-content/uploads/2021/07/Recurso-4-2.png"
                  alt="school crest"
                />
                <skooltrak-avatar
                  *ngIf="role()?.school?.crest_url"
                  class="h-12"
                  [avatarUrl]="role()?.school?.crest_url!"
                  bucket="crests"
                  alt="school crest"
                />
                <span
                  class="text-blue-700 font-semibold font-mono dark:text-white"
                  >{{ role()?.school?.short_name }}</span
                >
                <span
                  class="text-gray-600 font-mono text-xs truncate dark:text-gray-300"
                  >{{ role()?.role?.name }}</span
                >
              </button>
            </div>
            <div
              class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 left-5 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
              id="dropdown-user"
            >
              <div class="px-4 py-3" role="none">
                <p
                  class="text-sm text-sky-900 font-semibold dark:text-white"
                  role="none"
                >
                  {{ 'profile()?.full_name' }}
                </p>
                <p
                  class="text-xs font-medium text-gray-900 font-mono truncate dark:text-gray-300"
                  role="none"
                >
                  {{ 'profile()?.email' }}
                </p>
              </div>
              <ul class="py-1" role="none">
                <li class="separator">ROLES</li>
                <li class="separator">AUTHENTICATION</li>
                <li>
                  <a href="#" class="menu-item" role="menuitem">Profile</a>
                </li>
                <li>
                  <a href="#" class="menu-item" role="menuitem">Sign out</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <ul role="list" class="flex flex-col gap-1 mt-4">
          <li *ngFor="let link of links()">
            <a routerLinkActive="active" [routerLink]="link.route" class="link">
              <icon [name]="link.icon" class="w-6 h-6" />
              {{ link.name }}
            </a>
          </li>
        </ul>
      </div>
    </aside>
    <main class="p-8 mt-12 sm:ml-64 bg-white dark:bg-gray-800 min-h-screen">
      <router-outlet />
    </main>
  `,
  styles: [
    `
      .link {
        @apply text-gray-700 dark:text-gray-300 flex items-center rounded-lg gap-3 p-2 cursor-pointer font-mono;
      }

      .active {
        @apply text-blue-700 bg-blue-200 dark:bg-gray-600 dark:text-blue-500;
      }

      .menu-item {
        @apply block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white;
      }

      .separator {
        @apply text-xs text-gray-400 block px-4 py-2 font-mono;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private store = inject(Store);
  links = this.store.selectSignal(state.selectors.selectLinks);
  user = this.store.selectSignal(state.selectors.selectUser);
  role = this.store.selectSignal(state.selectors.selectCurrentRole);
}
