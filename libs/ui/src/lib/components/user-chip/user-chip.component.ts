import { IconsModule } from '@amithvns/ng-heroicons';
import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@skooltrak/models';

import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'sk-user-chip',
  standalone: true,
  imports: [AvatarComponent, IconsModule, NgIf],
  template: `<div
    class="flex items-center gap-2 rounded-full font-sans font-semibold text-gray-700 dark:text-gray-200"
  >
    <sk-avatar [avatarUrl]="user.avatar_url!" class="h-7" [rounded]="true" />
    {{ user.first_name }}
    {{ user.father_name }}
    <button *ngIf="removable" (click)="remove.emit(user)">
      <icon name="x-mark" class="h-3" />
    </button>
  </div>`,
})
export class UserChipComponent {
  @Input({ required: true }) user!: Partial<User>;
  @Input() removable = false;
  @Output() remove = new EventEmitter<Partial<User>>();
}
