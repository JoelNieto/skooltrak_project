import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmationOptions } from './confirmation.type';

@Component({
  selector: 'sk-confirmation',
  standalone: true,
  imports: [
    MatCardModule,
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
    <mat-card>
      <mat-card-header>
        <mat-card-title
          [innerHTML]="options.title | translate"
        ></mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p
          class="mat-body"
          [innerHTML]="options.description ?? '' | translate"
        ></p>
      </mat-card-content>
      <mat-card-footer>
        <mat-card-actions align="end">
          @if (options.showCancelButton) {
            <button
              mat-stroked-button
              [ngClass]="options.color"
              cdkFocusInitial
              (click)="dialogRef.close(false)"
            >
              {{
                options.cancelButtonText ?? 'Confirmation.Cancel' | translate
              }}
            </button>
          }
          <button
            mat-flat-button
            (click)="dialogRef.close(true)"
            [ngClass]="options.color"
          >
            {{ options.confirmButtonText ?? 'Confirm' | translate }}
          </button>
        </mat-card-actions>
      </mat-card-footer>
    </mat-card>
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
