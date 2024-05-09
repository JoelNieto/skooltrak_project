import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '@skooltrak/models';
import { ButtonDirective, CardComponent } from '@skooltrak/ui';

@Component({
  selector: 'sk-new-chat',
  standalone: true,
  template: ` <sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class=" font-title sticky top-0 flex pb-3 text-2xl font-bold leading-tight tracking-tight text-gray-700 dark:text-white"
      >
        {{ 'MESSAGING.NEW_CHAT' | translate }}
      </h3>

      <button (click)="dialogRef.close()"></button>
    </div>
    <div class="py-4"></div>
    <div class="flex justify-end" footer>
      <button
        skButton
        color="blue"
        (click)="saveUsers()"
        [disabled]="usersControl.invalid"
      >
        {{ 'CONFIRM' | translate }}
      </button>
    </div>
  </sk-card>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    TranslateModule,
    ButtonDirective,
    ReactiveFormsModule,
  ],
})
export class NewChatComponent {
  public readonly usersControl = new FormControl<Partial<User>[]>([], {
    validators: [Validators.minLength(1), Validators.required],
    nonNullable: true,
  });
  public dialogRef = inject(DialogRef);

  public saveUsers(): void {
    this.dialogRef.close(this.usersControl.getRawValue());
  }
}
