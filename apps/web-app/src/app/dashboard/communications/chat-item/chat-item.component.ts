import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'sk-chat-item',
  standalone: true,
  imports: [],
  template: `<p>{{ chatId() }}</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatItemComponent implements OnInit {
  public chatId = input.required<string>();

  public ngOnInit(): void {}
}
