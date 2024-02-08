import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { webStore } from '@skooltrak/store';
import { CardComponent, TabsComponent, TabsItemComponent } from '@skooltrak/ui';

@Component({
  standalone: true,
  selector: 'sk-home',
  imports: [
    CardComponent,
    TabsComponent,
    TabsItemComponent,
    TranslateModule,
    RouterOutlet,
  ],
  template: `<router-outlet />`,
})
export class HomeComponent {
  public auth = inject(webStore.AuthStore);
}
