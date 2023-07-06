import { Component, Input } from '@angular/core';
import { User } from '@skooltrak/models';

import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'sk-user-chip',
  standalone: true,
  imports: [AvatarComponent],
  template: `<div
    class="rounded-full p-1 pr-2 flex bg-cyan-500 text-white dark:bg-cyan-400 dark:text-cyan-800 gap-1 font-title"
  >
    <sk-avatar [avatarUrl]="user.avatar_url!" class="h-5" [rounded]="true" />
    {{ user.first_name }}
    {{ user.father_name }}
  </div>`,
})
export class UserChipComponent {
  @Input({ required: true }) user!: Partial<User>;
}
