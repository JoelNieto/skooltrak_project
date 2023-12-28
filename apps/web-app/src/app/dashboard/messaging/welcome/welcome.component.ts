import { Dialog } from '@angular/cdk/dialog';
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroChatBubbleLeft } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '@skooltrak/models';
import { webStore } from '@skooltrak/store';
import { ButtonDirective } from '@skooltrak/ui';

import { NewChatComponent } from '../new-chat/new-chat.component';

@Component({
  selector: 'sk-start-message',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ButtonDirective,
    TranslateModule,
    NgIconComponent,
  ],
  providers: [provideIcons({ heroChatBubbleLeft })],
  template: `<div
    class="flex flex-col items-center justify-center pt-12 gap-4 w-full h-full"
  >
    <img
      ngSrc="assets/images/notifications-isometric.svg"
      class="h-64"
      width="256"
      height="256"
    />
    <div>
      <h3 class="text-4xl font-title">{{ 'MESSAGING.WELCOME' | translate }}</h3>
      <p class="text-gray-500 font-sans text-center">
        {{ 'MESSAGING.WELCOME_MESSAGE' | translate }}
      </p>
    </div>

    <button skButton color="blue" (click)="newChat()">
      <ng-icon name="heroChatBubbleLeft" size="20" />
      {{ 'MESSAGING.NEW_CHAT' | translate }}
    </button>
  </div> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent {
  private dialog = inject(Dialog);
  private store = inject(webStore.MessagesStore);

  public newChat(): void {
    this.dialog
      .open<User[]>(NewChatComponent, { width: '24rem', maxWidth: '90%' })
      .closed.subscribe({
        next: (request) => {
          !!request && this.store.newChat(request.map((x) => x.id!));
        },
      });
  }
}
