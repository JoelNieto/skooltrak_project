import { Component, Input } from '@angular/core';

import { CalendarComponent } from '../../components/calendar/calendar.component';

@Component({
  standalone: true,
  selector: 'sk-schedule',
  imports: [CalendarComponent],
  template: `<sk-calendar [query_value]="course_id!" />`,
})
export class ScheduleComponent {
  @Input() course_id?: string;
}
