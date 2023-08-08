import { IconsModule } from '@amithvns/ng-heroicons';
import { JsonPipe, NgFor, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { authState } from '@skooltrak/auth';

import { AvatarComponent } from '../avatar/avatar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'sk-dashboard',
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
    TranslateModule,
  ],
  template: `
    <sk-navbar />
    <aside
      id="logo-sidebar"
      class="fixed left-0 top-0 z-40 mt-12 mt-14 flex h-screen w-64 -translate-x-full flex-col bg-white pt-4 transition-transform dark:bg-gray-800 sm:translate-x-0"
    >
      <div class="flex flex-col px-8 py-3">
        <div class="mb-2 flex items-center justify-center">
          <div class="flex items-center truncate">
            <div class="flex pl-2">
              <button
                type="button"
                class="flex flex-col content-center items-center justify-center gap-1 rounded-lg"
                aria-expanded="false"
                data-dropdown-toggle="dropdown-user"
              >
                <span class="sr-only">Open user menu</span>

                <span
                  class="font-sans font-semibold text-sky-700 dark:text-white"
                  >{{ 'role()?.school?.short_name' }}</span
                >
                <span
                  class="font-title truncate text-xs text-gray-600 dark:text-gray-300"
                  >{{ role()?.role }}</span
                >
              </button>
            </div>
            <div
              class="left-5 z-50 my-4 hidden list-none divide-y divide-gray-100 rounded bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700"
              id="dropdown-user"
            >
              <div class="px-4 py-3" role="none">
                <p
                  class="text-sm font-semibold text-sky-900 dark:text-white"
                  role="none"
                >
                  {{ 'profile()?.full_name' }}
                </p>
                <p
                  class="truncate font-mono text-xs font-medium text-gray-900 dark:text-gray-300"
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
        <ul role="list" class="mt-4 flex flex-col gap-1">
          <!-- <li *ngFor="let link of links()">
            <a
              routerLinkActive="active"
              [routerLink]="link.route"
              class="link font-sans"
            >
              <icon [name]="link.icon" class="h-6 w-6" />
              {{ link.name | translate }}
            </a>
          </li> -->
        </ul>
      </div>
    </aside>
    <main
      class="relative top-16 bg-gray-50 p-8 font-sans dark:bg-gray-900 sm:ml-64"
    >
      <router-outlet />
    </main>
  `,
  styles: [
    `
      .link {
        @apply flex cursor-pointer items-center gap-3 rounded-full p-1 px-3 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white;
      }

      .active {
        @apply bg-sky-200 text-sky-700 hover:bg-sky-200 dark:bg-gray-600 dark:text-sky-500 dark:hover:bg-gray-600 dark:hover:text-sky-500;
      }

      .menu-item {
        @apply block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white;
      }

      .separator {
        @apply block px-4 py-2 font-mono text-xs text-gray-400;
      }

      main {
        min-height: calc(100vh - 4rem);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private auth = inject(authState.AuthStateFacade);
  links = signal([]);
  user = inject(Store).selectSignal(this.auth.user);
  role = inject(Store).selectSignal(this.auth.currentRole);
}
