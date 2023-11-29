import { DialogModule } from '@angular/cdk/dialog';
import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBell,
  heroBookmarkSquare,
  heroCalendarDays,
  heroChatBubbleLeftRight,
  heroClipboardDocument,
  heroCog6Tooth,
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
    DialogModule,
  ],
  providers: [
    provideIcons({
      heroHome,
      heroBookmarkSquare,
      heroClipboardDocument,
      heroCalendarDays,
      heroCog6Tooth,
      heroBell,
      heroChatBubbleLeftRight,
    }),
  ],
  template: `<nav
    class="fixed top-0 z-50 w-full bg-emerald-600 dark:bg-gray-800"
  >
    <div class="px-4 py-3 lg:px-12">
      <div class="flex items-center justify-between">
        <div class="flex flex-1 items-center justify-start">
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
          <a routerLink="home" class="ml-2 flex md:mr-8">
            <img
              src="assets/images/skooltrak-white.svg"
              class="mr-2 h-7"
              alt="Skooltrak Logo"
            />
          </a>
        </div>
        <div class="flex flex-1 items-center justify-end gap-3">
          <button routerLink="messaging">
            <ng-icon
              name="heroChatBubbleLeftRight"
              class="text-white"
              size="24"
            />
          </button>
          <button>
            <ng-icon name="heroCog6Tooth" class="text-white" size="24" />
          </button>
          <button>
            <ng-icon name="heroBell" class="text-white" size="24" />
          </button>
          <div class="ml-3 flex items-center">
            <div>
              <button
                type="button"
                class="flex items-center justify-center gap-2 rounded p-1 text-sm"
                [cdkMenuTriggerFor]="menu"
              >
                <span class="sr-only">Open user menu</span>
                <sk-avatar
                  [avatarUrl]="USER()?.avatar_url ?? 'default_avatar.jpg'"
                  [rounded]="true"
                  class="w-8"
                />

                <div class="flex flex-col items-start">
                  <p
                    class="font-sans text-sm font-semibold text-gray-50 dark:text-white"
                  >
                    {{ USER()?.first_name }} {{ USER()?.father_name }}
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
                    {{ USER()?.first_name }} {{ USER()?.father_name }}
                  </p>
                  <p
                    class="truncate font-sans text-sm text-gray-500 dark:text-gray-300"
                    role="none"
                  >
                    {{ USER()?.email }}
                  </p>
                </div>
                <ul class="py-1" role="none">
                  <li>
                    <a
                      routerLink="profile"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      cdkMenuItem
                      >{{ 'PROFILE.TITLE' | translate }}</a
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
  styles: `
      .menu-item {
        @apply block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white;
      }
      .link {
        @apply flex gap-2 px-4 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-sky-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500;
        &.active {
          @apply flex gap-2 rounded-lg bg-sky-200 px-4 py-2 font-semibold text-sky-700;
        }
      }
    `,
})
export class NavbarComponent {
  private auth = inject(authState.AuthStateFacade);

  public USER = this.auth.USER;
  public SCHOOL = this.auth.CURRENT_SCHOOL;
  public IS_ADMIN = this.auth.IS_ADMIN;
}
