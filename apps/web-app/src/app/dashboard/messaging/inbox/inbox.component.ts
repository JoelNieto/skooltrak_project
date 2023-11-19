import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MessagingStore } from '../messaging.store';

@Component({
  selector: 'sk-inbox',
  standalone: true,
  imports: [JsonPipe],
  template: `@for (channel of store.CHANNELS(); track channel.id) {
    {{ channel.members | json }}
  }`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxComponent {
  public store = inject(MessagingStore);
}
