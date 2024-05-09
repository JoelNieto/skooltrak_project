import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'sk-communications',
  standalone: true,
  imports: [TranslateModule, RouterOutlet],
  template: `<h2 class="mat-display-medium">
      {{ 'MESSAGING.TITLE' | translate }}
    </h2>
    <router-outlet /> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunicationsComponent {}
