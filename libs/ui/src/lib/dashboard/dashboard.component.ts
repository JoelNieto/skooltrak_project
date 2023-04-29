import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'skooltrak-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink],
  template: `<div class="flex bg-white w-full h-screen">
    <aside class="bg-gray-100 p-2 md:w-64 w-48 flex-none h-full top-0 left-0">
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
            <a
              routerLinkActive="active"
              [routerLink]="['home']"
              class="text-gray-700 flex items-center rounded-lg gap-3 hover:text-sky-600 p-2 cursor-pointer font-sans"
              rou
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              Home
            </a>
          </li>
          <li>
            <a
              routerLinkActive="active"
              [routerLink]="['schools']"
              class="text-gray-700 flex items-center rounded-lg gap-3 hover:text-sky-600 p-2 cursor-pointer font-sans"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                />
              </svg>
              Schools
            </a>
          </li>
        </ul>
      </div>
    </aside>
    <main class="flex-auto p-10">
      <ng-content select="[content]"></ng-content>
    </main>
  </div> `,
  styles: [
    `
      .active {
        @apply text-sky-600 bg-gray-200 font-semibold;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
