import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { CardComponent } from '../card/card.component';
import { ConfirmationOptions } from './confirmation.type';

@Component({
  selector: 'sk-confirmation',
  standalone: true,
  imports: [CardComponent, TranslateModule, DialogModule, MatButton, MatIcon],
  providers: [],
  styles: `
    .mat-icon{
      transform: scale(2);
    }`,
  template: `
    <sk-card>
      <div class="flex justify-center">
        <mat-icon [color]="options.color">{{ options.icon }}</mat-icon>
      </div>
      <p
        class="font-title my-3 text-center text-lg font-semibold text-gray-600 dark:text-gray-100"
        [innerHTML]="options.title | translate"
      ></p>
      <p
        class="my-3 text-center text-sm text-gray-400 dark:text-gray-300"
        [innerHTML]="options.description ?? '' | translate"
      ></p>
      <div footer class="my-3 flex justify-around px-4">
        @if (options.showCancelButton) {
          <button
            mat-button
            [color]="options.color"
            cdkFocusInitial
            (click)="dialogRef.close(false)"
          >
            {{ options.cancelButtonText ?? 'Confirmation.Cancel' | translate }}
          </button>
        }
        <button
          mat-flat-button
          class="rounded-full px-5 py-2.5 font-sans text-white"
          [color]="options.color"
          (click)="dialogRef.close(true)"
        >
          {{ options.confirmButtonText ?? 'Confirm' | translate }}
        </button>
      </div>
    </sk-card>
  `,
})
export class ConfirmationComponent implements OnInit {
  public options!: ConfirmationOptions;
  public dialogRef = inject(DialogRef<boolean>);
  private data: {
    options: ConfirmationOptions;
  } = inject(DIALOG_DATA);

  ngOnInit(): void {
    this.options = this.data.options;
  }
}
