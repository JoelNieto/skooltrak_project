import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sk-chats-loading',
  standalone: true,
  imports: [CommonModule],
  template: `<p>chats-loading works!</p>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsLoadingComponent {}
