import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { ClassGroup } from '@skooltrak/models';
import { CardComponent } from '@skooltrak/ui';

@Component({
  selector: 'sk-admin-groups-form',
  standalone: true,
  imports: [CardComponent, TranslateModule, NgIconComponent],
  providers: [provideIcons({ heroXMark })],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'Groups.Details' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <ng-icon
          name="heroXMark"
          size="24"
          class="text-gray-700 dark:text-gray-100"
        />
      </button>
    </div>
  </sk-card>`,
})
export class GroupsFormComponent {
  public dialogRef = inject(DialogRef<Partial<ClassGroup>>);
  private data: ClassGroup | undefined = inject(DIALOG_DATA);
}
