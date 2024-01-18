import { Component, input } from '@angular/core';

import { CalendarComponent } from '../../../components/calendar/calendar.component';

@Component({
  standalone: true,
  selector: 'sk-schedule',
  imports: [CalendarComponent],
  template: `@defer {
    <sk-calendar [queryValue]="course_id()" />
  }`,
})
export class ScheduleComponent {
  public course_id = input.required<string>();
}
