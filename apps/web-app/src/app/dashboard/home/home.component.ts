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
  template: ` <sk-card>
    <div header>
      <h2
        class="font-title mb-2 flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
      >
        {{ 'WELCOME' | translate: { name: auth.user()?.first_name } }}
      </h2>
    </div>
    <router-outlet />
  </sk-card>`,
})
export class HomeComponent {
  public auth = inject(webStore.AuthStore);
}
