import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ScheduleComponent } from '../../../components/schedule/schedule.component';

@Component({
  standalone: true,
  selector: 'sk-home-schedule',
  template: `<div>
    <h1 class="mat-headline-3">
      {{ 'SCHEDULE' | translate }}
    </h1>

    <sk-schedule />
  </div> `,
  imports: [TranslateModule, ScheduleComponent],
})
export class HomeScheduleComponent {
  public course_id = input.required<string>();
}
