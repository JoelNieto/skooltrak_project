import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';

import { ConfirmationComponent } from './confirmation.component';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private dialog = inject(Dialog);

  openDialog = (
    type: 'delete' | 'info' | 'warning' = 'delete',
    description: string = 'Item'
  ) =>
    this.dialog.open(ConfirmationComponent, {
      width: '24rem',
      maxWidth: '90vw',
      data: { type, description },
    }).closed;
}
