import { Component } from '@angular/core';

@Component({
  selector: 'sk-card',
  standalone: true,
  template: `
    <div
      class="w-100 rounded-xl bg-white p-6 drop-shadow-xl dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="mb-3">
        <ng-content select="[header]"></ng-content>
      </div>
      <ng-content></ng-content>
      <ng-content select="[footer]"></ng-content>
    </div>
  `,
})
export class CardComponent {}
