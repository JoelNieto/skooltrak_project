import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroExclamationCircle } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';

import { CardComponent } from '../card/card.component';

@Component({
  selector: 'sk-confirmation',
  standalone: true,
  imports: [CardComponent, TranslateModule, NgIconComponent, DialogModule],
  providers: [provideIcons({ heroExclamationCircle })],
  template: `
    <sk-card>
      <div class="mb-3 flex justify-center">
        <div class="rounded-full bg-red-200 p-2">
          <ng-icon
            name="heroExclamationCircle"
            size="22"
            class="text-red-600"
          />
        </div>
      </div>
      <p class="mb-3 text-center font-sans text-gray-500">
        {{ 'Confirmation.Delete.Text' | translate }}
      </p>

      <div class="flex justify-around px-4">
        <button
          class="rounded-full bg-white px-5 py-2 font-sans text-red-500 dark:bg-gray-600"
          cdkFocusInitial
          (click)="dialogRef.close(false)"
        >
          {{ 'Confirmation.Cancel' | translate }}
        </button>
        <button
          class="rounded-full bg-red-600 px-5 py-2 font-sans text-white"
          (click)="dialogRef.close(true)"
        >
          {{ 'Confirm' | translate }}
        </button>
      </div>
    </sk-card>
  `,
  styles: [],
})
export class ConfirmationComponent {
  public dialogRef = inject(DialogRef<boolean>);
}
