import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheckCircle, heroExclamationCircle, heroTrash, heroXCircle } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';

import { CardComponent } from '../card/card.component';
import { ConfirmationOptions } from './confirmation.type';

@Component({
  selector: 'sk-confirmation',
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    NgIconComponent,
    DialogModule,
    NgIf,
  ],
  providers: [
    provideIcons({
      heroExclamationCircle,
      heroCheckCircle,
      heroTrash,
      heroXCircle,
    }),
  ],
  template: `
    <sk-card>
      <div class="flex justify-center">
        <ng-icon
          [name]="options.icon"
          size="52"
          [class]="iconColor[options.color]"
        />
      </div>
      <p
        class="font-title my-3 text-center text-lg font-semibold text-gray-600"
        [innerHTML]="options.title"
      ></p>
      <p
        class="my-3 text-center text-sm text-gray-400"
        [innerHTML]="options.description"
      ></p>
      <div class="my-3 flex justify-around px-4">
        <button
          *ngIf="options.showCancelButton"
          class="rounded-full bg-white px-5 py-2.5 font-sans dark:bg-gray-600"
          [class]="cancelButtonColor[options.color]"
          cdkFocusInitial
          (click)="dialogRef.close(false)"
        >
          {{ options.cancelButtonText ?? 'Confirmation.Cancel' | translate }}
        </button>
        <button
          class="rounded-full px-5 py-2.5 font-sans text-white"
          [class]="confirmButtonColor[options.color]"
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

  public iconColor = {
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    red: 'text-red-400',
  };

  public confirmButtonColor = {
    blue: 'bg-blue-300',
    yellow: 'bg-yellow-400',
    green: 'bg-green-400',
    red: 'bg-red-400',
  };

  public cancelButtonColor = {
    blue: 'text-blue-300',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    red: 'text-red-400',
  };
}
