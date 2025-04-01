import { Component, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'sk-card',
    imports: [MatProgressSpinner],
    template: `
    <div
      class="w-100 rounded-xl bg-white border border-gray-300 p-5 dark:border-gray-700 dark:bg-gray-800 relative"
      [class.opacity-20]="loading()"
    >
      <div class="pb-2">
        <ng-content select="[header]"></ng-content>
      </div>
      @if (loading()) {
        <mat-spinner class="absolute z-50 top-1/3 left-1/2 h-16 w-16" />
      }

      <div>
        <ng-content></ng-content>
      </div>

      <ng-content select="[footer]"></ng-content>
    </div>
  `
})
export class CardComponent {
  public loading = input(false);
}
