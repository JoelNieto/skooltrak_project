import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CardComponent } from '@skooltrak/ui';

@Component({
  selector: 'skooltrak-admin-students',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CardComponent],
  template: `
    <skooltrak-card>
      <h2
        class=" sticky top-0 pb-2 leading-tight tracking-tight flex text-gray-700 dark:text-white text-2xl font-title font-bold"
      >
        Students
      </h2>
      <div
        class="text-sm font-medium text-center text-gray-500 border-b font-title border-gray-200 dark:text-gray-400 mb-2 dark:border-gray-700"
      >
        <ul class="flex flex-wrap -mb-px">
          <li class="mr-2">
            <a routerLink="all" routerLinkActive="active" class="link"
              >Active</a
            >
          </li>
          <li class="mr-2">
            <a routerLink="admission" routerLinkActive="active" class="link"
              >Admission</a
            >
          </li>
          <li class="mr-2">
            <a href="#" class="link">Settings</a>
          </li>
          <li>
            <a
              class="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500"
              >Disabled</a
            >
          </li>
        </ul>
      </div>
      <router-outlet />
    </skooltrak-card>
  `,
  styles: [
    `
      .link {
        @apply inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 dark:hover:text-gray-300;

        &.active {
          @apply text-sky-600 border-sky-600 dark:text-sky-500 dark:border-sky-500;
        }

        &.disabled {
          @apply text-gray-400 cursor-not-allowed dark:text-gray-500;
        }
      }
    `,
  ],
})
export class StudentsComponent {}
