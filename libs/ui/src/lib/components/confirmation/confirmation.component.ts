import { DialogModule } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmationOptions } from './confirmation.type';

@Component({
  selector: 'sk-confirmation',
  standalone: true,
  imports: [
    MatDialogModule,
    TranslateModule,
    DialogModule,
    MatButton,
    MatIcon,
    NgClass,
  ],
  providers: [],
  styles: `
    .mat-icon{
      transform: scale(2);
    }`,
  template: `
    <h2 mat-dialog-title [innerHTML]="options.title | translate"></h2>

    <mat-dialog-content>
      <p
        class="mat-body"
        [innerHTML]="options.description ?? '' | translate"
      ></p>
    </mat-dialog-content>
    <mat-dialog-actions>
      @if (options.showCancelButton) {
        <button mat-stroked-button [ngClass]="options.color" mat-dialog-close>
          {{ options.cancelButtonText ?? 'Confirmation.Cancel' | translate }}
        </button>
      }
      <button
        mat-flat-button
        cdkFocusInitial
        [mat-dialog-close]="true"
        [ngClass]="options.color"
      >
        {{ options.confirmButtonText ?? 'Confirm' | translate }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmationComponent implements OnInit {
  public options!: ConfirmationOptions;
  private data: {
    options: ConfirmationOptions;
  } = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.options = this.data.options;
  }
}
