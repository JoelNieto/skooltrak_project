import { booleanAttribute, Component, Input } from '@angular/core';

@Component({
  selector: 'sk-tabs',
  standalone: true,
  styles: [
    `
      :host {
        @apply my-2 text-center font-sans text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400;
      }
    `,
  ],
  template: `<ul class="-mb-px flex flex-wrap" [class.justify-center]="center">
    <ng-content></ng-content>
  </ul>`,
})
export class TabsComponent {
  @Input({ transform: booleanAttribute }) center: boolean = false;
}
