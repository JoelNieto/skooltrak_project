import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '@skooltrak/ui';

import { CalendarComponent } from '../../components/calendar/calendar.component';

@Component({
  standalone: true,
  selector: 'sk-schedule',
  imports: [CalendarComponent, CardComponent, TranslateModule],
  template: `<sk-card>
    <div header>
      <h2
        class="font-title mb-2 flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
      >
        {{ 'SCHEDULE' | translate }}
      </h2>
    </div>

    <sk-calendar [queryValue]="course_id()" />
  </sk-card> `,
})
export class ScheduleComponent {
  public course_id = input.required<string>();
}
