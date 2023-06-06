import { IconsModule } from '@amithvns/ng-heroicons';
import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CardComponent } from '../card/card.component';

@Component({
  selector: 'skooltrak-confirmation',
  standalone: true,
  imports: [CardComponent, TranslateModule, IconsModule, DialogModule],
  template: `
    <skooltrak-card>
      <div class="flex justify-center mb-3">
        <div class="rounded-full bg-red-200 p-2">
          <icon name="exclamation-circle" class="h-10 w-10 text-red-600" />
        </div>
      </div>
      <p class="font-sans text-gray-500 mb-3 text-center">
        {{ 'Confirmation.Delete.Text' | translate }}
      </p>

      <div class="flex justify-around px-4">
        <button
          class="bg-white text-red-500 font-sans dark:bg-gray-600 rounded-full px-5 py-2"
          cdkFocusInitial
          (click)="dialogRef.close(false)"
        >
          {{ 'Confirmation.Cancel' | translate }}
        </button>
        <button
          class="bg-red-600 text-white font-sans rounded-full px-5 py-2"
          (click)="dialogRef.close(true)"
        >
          {{ 'Confirm' | translate }}
        </button>
      </div>
    </skooltrak-card>
  `,
  styles: [],
})
export class ConfirmationComponent {
  public dialogRef = inject(DialogRef<boolean>);
}
