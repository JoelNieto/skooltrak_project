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
        @apply inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:text-gray-600 dark:hover:text-gray-300;
      }
      .active {
        @apply border-sky-600 font-semibold text-gray-800 dark:border-sky-600 dark:text-sky-600;
      }
      .disabled {
        @apply cursor-not-allowed text-gray-400 dark:text-gray-500;
      }
    `,
  ],
  template: `<li class="mr-2">
    <a
      routerLink="{{ link }}"
      routerLinkActive="active"
      queryParamsHandling="preserve"
      class="link flex items-center gap-2 font-sans"
    >
      <ng-content />
    </a>
  </li>`,
})
export class TabsItemComponent {
  @Input({ required: true }) link!: string;
}
