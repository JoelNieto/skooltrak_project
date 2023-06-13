import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '@skooltrak/ui';

@Component({
  selector: 'skooltrak-courses',
  standalone: true,
  imports: [CardComponent, TranslateModule],
  template: `<skooltrak-card>
    <div header>
      <h2
        class="leading-tight tracking-tight flex text-gray-700 dark:text-white text-2xl font-title font-bold"
      >
        {{ 'Courses' | translate }}
      </h2>
    </div>
  </skooltrak-card>`,
})
export class CoursesComponent {}
