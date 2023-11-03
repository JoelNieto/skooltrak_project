import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent, TabsComponent, TabsItemComponent } from '@skooltrak/ui';

@Component({
  standalone: true,
  selector: 'sk-settings',
  imports: [
    CardComponent,
    TranslateModule,
    RouterOutlet,
    TabsComponent,
    TabsItemComponent,
  ],
  template: ` <sk-card>
    <div header>
      <h2
        class="font-title mb-1 flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
      >
        {{ 'Settings' | translate }}
      </h2>
    </div>
    <div>
      <sk-tabs>
        <sk-tabs-item link="schools">{{ 'Schools' | translate }}</sk-tabs-item>
      </sk-tabs>
      <router-outlet />
    </div>
  </sk-card>`,
})
export class SettingsComponent {}
