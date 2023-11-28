import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { messagingState } from '@skooltrak/auth';
import { CardComponent, TabsComponent, TabsItemComponent } from '@skooltrak/ui';

import { ChatsLoadingComponent } from './chats-loading/chats-loading.component';
import { MessagingStore } from './messaging.store';

@Component({
  selector: 'sk-messaging',
  standalone: true,
  providers: [provideComponentStore(MessagingStore)],
  template: `<h2
      class="font-title flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
    >
      {{ 'MESSAGING.TITLE' | translate }}
    </h2>
    <div class="mt-2">
      @if (store.LOADING()) {
        <sk-chats-loading />
      } @else {
        <router-outlet />
      }
    </div> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    TabsItemComponent,
    TabsComponent,
    CardComponent,
    RouterOutlet,
    ChatsLoadingComponent,
  ],
})
export class MessagingComponent {
  public readonly store = inject(messagingState.MessagingStateFacade);
}
