import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '@skooltrak/models';
import { ButtonDirective, CardComponent } from '@skooltrak/ui';

import { UsersSelectorComponent } from '../../../components/users-selector/users-selector.component';

@Component({
  selector: 'sk-new-chat',
  standalone: true,
  providers: [provideIcons({ heroXMark })],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class=" font-title sticky top-0 flex pb-3 text-2xl font-bold leading-tight tracking-tight text-gray-700 dark:text-white"
      >
        {{ 'MESSAGING.NEW_CHAT' | translate }}
      </h3>

      <button (click)="dialogRef.close()">
        <ng-icon
          name="heroXMark"
          size="24"
          class="text-gray-700 dark:text-gray-100"
        />
      </button>
    </div>
    <div class="py-4">
      <sk-users-selector [formControl]="usersControl" single />
    </div>
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
    NgIconComponent,
    ButtonDirective,
    UsersSelectorComponent,
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
