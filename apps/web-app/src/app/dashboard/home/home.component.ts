import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { webStore } from '@skooltrak/store';

@Component({
    selector: 'sk-home',
    imports: [RouterOutlet],
    template: `<router-outlet />`
})
export class HomeComponent {
  public auth = inject(webStore.AuthStore);
}
