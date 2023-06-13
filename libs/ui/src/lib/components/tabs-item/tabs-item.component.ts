import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'skooltrak-tabs-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  styles: [
    `
      .link {
        @apply inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 dark:hover:text-gray-300;
      }
      .active {
        @apply text-sky-500 border-sky-500 dark:text-sky-500 dark:border-sky-500;
      }
      .disabled {
        @apply text-gray-400 cursor-not-allowed dark:text-gray-500;
      }
    `,
  ],
  template: `<li class="mr-2">
    <a routerLink="{{ link }}" routerLinkActive="active" class="link">
      <ng-content />
    </a>
  </li>`,
  inputs: [{ name: 'link', required: true, alias: 'route' }],
})
export class TabsItemComponent {
  link!: string;
}
