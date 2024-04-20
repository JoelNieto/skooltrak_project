import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { ConfirmationComponent } from './confirmation.component';
import { ConfirmationOptions } from './confirmation.type';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private dialog = inject(MatDialog);

  openDialog = (options: ConfirmationOptions) =>
    this.dialog
      .open(ConfirmationComponent, {
        width: '24rem',
        maxWidth: '90vw',
        data: { options },
      })
      .afterClosed();

  openDialogPromise = (options: ConfirmationOptions): Promise<boolean> =>
    firstValueFrom(this.openDialog(options));
}
