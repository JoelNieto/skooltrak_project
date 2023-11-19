import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent, TabsComponent, TabsItemComponent } from '@skooltrak/ui';

import { MessagingStore } from './messaging.store';

@Component({
  selector: 'sk-messaging',
  standalone: true,
  imports: [
    TranslateModule,
    TabsItemComponent,
    TabsComponent,
    CardComponent,
    RouterOutlet,
  ],
  providers: [provideComponentStore(MessagingStore)],
  template: `<h2
      class="font-title flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
    >
      {{ 'MESSAGING.TITLE' | translate }}
    </h2>
    <sk-tabs center>
      <sk-tabs-item link="inbox">{{
        'MESSAGING.INBOX' | translate
      }}</sk-tabs-item>
      <sk-tabs-item link="archived">{{
        'MESSAGING.ARCHIVED' | translate
      }}</sk-tabs-item>
    </sk-tabs>
    <router-outlet />`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingComponent {
  private readonly store = inject(MessagingStore);
}
