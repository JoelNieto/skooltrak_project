import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';

import { ConfirmationComponent } from './confirmation.component';
import { ConfirmationOptions } from './confirmation.type';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private dialog = inject(Dialog);

  openDialog = (options: ConfirmationOptions) =>
    this.dialog.open<boolean>(ConfirmationComponent, {
      width: '24rem',
      maxWidth: '90vw',
      data: { options },
    }).closed;
}
