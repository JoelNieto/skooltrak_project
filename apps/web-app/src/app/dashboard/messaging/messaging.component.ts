import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { webStore } from '@skooltrak/store';
import { CardComponent } from '@skooltrak/ui';

import { ChatsLoadingComponent } from './chats-loading/chats-loading.component';

@Component({
  selector: 'sk-messaging',
  standalone: true,
  template: `<h2
      class="font-title flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
    >
      {{ 'MESSAGING.TITLE' | translate }}
    </h2>
    <div class="mt-2">
      @if (store.loading()) {
        <sk-chats-loading />
      } @else {
        <router-outlet />
      }
    </div> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    CardComponent,
    RouterOutlet,
    ChatsLoadingComponent,
  ],
})
export class MessagingComponent {
  public readonly store = inject(webStore.MessagesStore);
}
