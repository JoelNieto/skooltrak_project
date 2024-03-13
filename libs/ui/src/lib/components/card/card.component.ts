import { Component, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'sk-card',
  standalone: true,
  imports: [MatProgressSpinner],
  template: `
    <div
      class="w-100 rounded-xl bg-white border border-gray-300 p-5 dark:border-gray-700 dark:bg-gray-800 relative"
      [class.opacity-20]="loading()"
    >
      <div>
        <ng-content select="[header]"></ng-content>
      </div>
      @if (loading()) {
        <mat-spinner class="absolute z-50 top-1/3 left-1/2 h-16 w-16" />
      }

      <div class="py-4">
        <ng-content></ng-content>
      </div>

      <ng-content select="[footer]"></ng-content>
    </div>
  `,
})
export class CardComponent {
  public loading = input(false);
}
