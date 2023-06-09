import { Component } from '@angular/core';

@Component({
  selector: '[skooltrak-tabs]',
  standalone: true,
  styles: [
    `
      :host {
        @apply text-sm font-medium text-center text-gray-500 border-b font-title border-gray-200 dark:text-gray-400 mb-2 dark:border-gray-700;
      }
    `,
  ],
  template: `<ul class="flex flex-wrap -mb-px">
    <ng-content></ng-content>
  </ul>`,
})
export class TabsComponent {}
