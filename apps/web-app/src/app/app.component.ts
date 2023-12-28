import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { webStore } from '@skooltrak/store';

@Component({
  selector: 'sk-root',
  standalone: true,
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
})
export class AppComponent {
  private auth = inject(webStore.AuthStore);
}
