import { Component, Input } from '@angular/core';
import { CalendarComponent } from '@skooltrak/ui';

@Component({
  standalone: true,
  selector: 'sk-course-schedule',
  imports: [CalendarComponent],
  template: `<sk-calendar [query_value]="course_id" query_item="course_id" />`,
})
export class CourseScheduleComponent {
  @Input() course_id: string | undefined;
}
