import { Component, EventEmitter, input, Output } from '@angular/core';
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
    class="flex p-1 pr-2 items-center text-xs gap-2 rounded-full font-sans font-semibold bg-pink-100 text-pink-700 dark:bg-pink-700 dark:text-gray-200"
  >
    <sk-avatar
      [fileName]="user().avatar_url ?? 'default_avatar.jpg'"
      class="h-6"
      [rounded]="true"
    />
    {{ user().first_name }}
    {{ user().father_name }}
    @if (removable()) {
      <button (click)="remove.emit(user())">
        <ng-icon name="heroXMark" size="16" />
      </button>
    }
  </div>`,
})
export class UserChipComponent {
  public user = input.required<Partial<User>>();
  public removable = input(false);
  @Output() public remove = new EventEmitter<Partial<User>>();
}
