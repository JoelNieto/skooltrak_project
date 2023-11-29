import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroChatBubbleLeft } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { messagingState } from '@skooltrak/store';
import { User } from '@skooltrak/models';
import { ButtonDirective, DateAgoPipe } from '@skooltrak/ui';

import { AvatarComponent } from '../../../components/avatar/avatar.component';
import { NewChatComponent } from '../new-chat/new-chat.component';

@Component({
  selector: 'sk-inbox',
  standalone: true,
  imports: [
    AvatarComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ButtonDirective,
    TranslateModule,
    NgIconComponent,
    DateAgoPipe,
  ],
  providers: [provideIcons({ heroChatBubbleLeft })],
  template: `<div
    class="flex w-full h-[36rem] shadow-xl bg-white dark:bg-gray-700 rounded-lg"
  >
    <div class=" border-r border-gray-200 flex flex-col w-1/3">
      <div class="w-full flex items-center justify-center py-6 px-4">
        <button skButton color="blue" (click)="newChat()">
          <ng-icon name="heroChatBubbleLeft" size="20" />
          {{ 'MESSAGING.NEW_CHAT' | translate }}
        </button>
      </div>
      <ul class="pb-4 flex flex-col overflow-y-scroll">
        @for (chat of state.CHATS(); track chat.id) {
          <li
            class="border-b last:border-b-0  border-gray-200 dark:border-gray-700"
          >
            <a
              class="flex justify-between px-6 py-4 gap-2 items-center hover:bg-gray-100"
              routerLink="chat"
              routerLinkActive="bg-emerald-50 dark:bg-emerald-800 "
              [queryParams]="{ chat_id: chat.id }"
            >
              <div class="flex items-center gap-2">
                @for (member of chat.members; track member.user_id) {
                  <sk-avatar
                    [avatarUrl]="member.user.avatar_url ?? 'default_avatar.jpg'"
                    class="h-12"
                    rounded
                  />
                  <div
                    class="flex flex-col text-sm justify-center text-emerald-800 dark:text-emerald-200"
                  >
                    {{ member.user.first_name }} {{ member.user.father_name }}
                    <span class="font-mono text-gray-600 text-xs font-thin">{{
                      member.user.email
                    }}</span>
                  </div>
                }
              </div>
              <div class="text-xs text-gray-400 flex items-end">
                {{ chat.last_message | dateAgo }}
              </div>
            </a>
          </li>
        }
      </ul>
    </div>
    <div class="flex-1 flex flex-col">
      <div class="w-full px-8 py-3 border-b border-gray-200 flex gap-2">
        @for (member of state.SELECTED()?.members; track member.user_id) {
          <sk-avatar
            [avatarUrl]="member.user.avatar_url ?? 'default_avatar.jpg'"
            class="h-8"
            rounded
          />
          <div
            class="flex flex-col justify-center text-lg text-emerald-800 dark:text-emerald-200"
          >
            {{ member.user.first_name }} {{ member.user.father_name }}
          </div>
        }
      </div>
      <div class="bg-white dark:bg-emerald-950 ">
        <router-outlet />
      </div>
    </div>
  </div> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxComponent {
  public state = inject(messagingState.MessagingStateFacade);
  private dialog = inject(Dialog);

  public newChat(): void {
    this.dialog
      .open<Partial<User>[]>(NewChatComponent, {
        width: '24rem',
        maxWidth: '90%',
      })
      .closed.subscribe({
        next: (val) => !!val && this.state.newChat(val.map((x) => x.id!)),
      });
  }
}
