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
    class="flex items-center text-xs gap-2 rounded-full font-sans font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-700 dark:text-gray-200 p-1"
  >
    <sk-avatar
      [avatarUrl]="user.avatar_url ?? 'default_avatar.jpg'"
      class="h-6"
      [rounded]="true"
    />
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
