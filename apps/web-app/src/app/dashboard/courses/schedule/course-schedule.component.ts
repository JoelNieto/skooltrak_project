import { Component, Input } from '@angular/core';

import { CalendarComponent } from '../../../components/calendar/calendar.component';

@Component({
  standalone: true,
  selector: 'sk-course-schedule',
  imports: [CalendarComponent],
  template: `<sk-calendar [queryValue]="course_id" queryItem="course_id" />`,
})
export class CourseScheduleComponent {
  @Input() public course_id: string | undefined;
}
