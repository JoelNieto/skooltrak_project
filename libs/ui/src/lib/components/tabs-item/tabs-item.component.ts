import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'sk-tabs-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  styles: [
    `
      .link {
        @apply inline-block rounded-lg px-5 py-2.5 hover:text-gray-800 dark:hover:text-gray-300;
      }
      .active {
        @apply bg-blue-500 font-semibold text-gray-50 hover:text-gray-50 dark:bg-blue-300 dark:text-blue-800 dark:hover:text-blue-800;
      }
      .disabled {
        @apply cursor-not-allowed text-gray-400 dark:text-gray-500;
      }
    `,
  ],
  template: `<li class="mr-2">
    <a
      routerLink="{{ link() }}"
      routerLinkActive="active"
      queryParamsHandling="preserve"
      class="link flex items-center gap-2 font-sans"
    >
      <ng-content />
    </a>
  </li>`,
})
export class TabsItemComponent {
  public link = input.required<string>();
}
