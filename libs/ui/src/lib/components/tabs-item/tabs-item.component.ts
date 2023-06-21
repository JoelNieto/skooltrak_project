import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'sk-tabs-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  styles: [
    `
      .link {
        @apply inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 dark:hover:text-gray-300;
      }
      .active {
        @apply text-gray-800 border-sky-600 dark:text-sky-600 dark:border-sky-600;
      }
      .disabled {
        @apply text-gray-400 cursor-not-allowed dark:text-gray-500;
      }
    `,
  ],
  template: `<li class="mr-2">
    <a
      routerLink="{{ link }}"
      routerLinkActive="active"
      class="link flex gap-2 items-center"
    >
      <ng-content />
    </a>
  </li>`,
})
export class TabsItemComponent {
  @Input({ required: true }) link!: string;
}
