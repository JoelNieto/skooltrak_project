import { Component } from '@angular/core';

@Component({
  selector: 'sk-card',
  standalone: true,
  template: `
    <div class="rounded-xl bg-white p-6 dark:bg-gray-800">
      <ng-content select="[header]"></ng-content>
      <ng-content></ng-content>
      <ng-content select="[footer]"></ng-content>
    </div>
  `,
})
export class CardComponent {}
