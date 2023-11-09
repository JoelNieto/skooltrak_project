import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { User } from '@skooltrak/models';

import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'sk-user-chip',
  standalone: true,
  imports: [AvatarComponent, NgIconComponent],
  providers: [provideIcons({ heroXMark })],
  template: `<div
    class="flex items-center gap-2 rounded-full font-sans font-semibold text-gray-700 dark:text-gray-200"
  >
    <sk-avatar [avatarUrl]="user.avatar_url!" class="h-7" [rounded]="true" />
    {{ user.first_name }}
    {{ user.father_name }}
    @if(removable) {
      <button (click)="remove.emit(user)">
      <ng-icon name="heroXMark" size="4" />
    </button>
    }

  </div>`,
})
export class UserChipComponent {
  @Input({ required: true }) public user!: Partial<User>;
  @Input() public removable = false;
  @Output() public remove = new EventEmitter<Partial<User>>();
}
