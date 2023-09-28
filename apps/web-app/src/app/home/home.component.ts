import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { authState } from '@skooltrak/auth';
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
        class="font-title flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
      >
        {{ 'Welcome' | translate : { name: auth.user()?.first_name } }}
      </h2>
    </div>
    <div class="mt-2" skooltrak-tabs>
      <sk-tabs-item link="schedule">{{ 'Schedule' | translate }}</sk-tabs-item>
      <sk-tabs-item link="grades">
        {{ 'Grades.Title' | translate }}</sk-tabs-item
      >
    </div>
    <router-outlet />
  </sk-card>`,
})
export class HomeComponent {
  public auth = inject(authState.AuthStateFacade);
}
