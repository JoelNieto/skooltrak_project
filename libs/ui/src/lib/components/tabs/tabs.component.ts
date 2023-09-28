import { Component } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[skooltrak-tabs]',
  standalone: true,
  styles: [
    `
      :host {
        @apply mb-2 border-b border-gray-200 text-center font-sans text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400;
      }
    `,
  ],
  template: `<ul class="-mb-px flex flex-wrap">
    <ng-content></ng-content>
  </ul>`,
})
export class TabsComponent {}
