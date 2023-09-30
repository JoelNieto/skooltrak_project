import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent, TabsComponent, TabsItemComponent } from '@skooltrak/ui';

@Component({
  standalone: true,
  selector: 'sk-school',
  imports: [
    RouterOutlet,
    CardComponent,
    TabsComponent,
    TabsItemComponent,
    TranslateModule,
  ],
  template: `<sk-card>
    <div header>
      <h2
        class="font-title mb-1 flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
      >
        {{ 'School settings' | translate }}
      </h2>
    </div>
    <div>
      <div skooltrak-tabs>
        <sk-tabs-item link="info">{{ 'Info' | translate }}</sk-tabs-item>
      </div>
      <router-outlet />
    </div>
  </sk-card>`,
})
export class SchoolComponent {}
