import { Component, input } from '@angular/core';

import { ScheduleComponent } from '../../../components/schedule/schedule.component';

@Component({
  standalone: true,
  selector: 'sk-course-schedule',
  imports: [ScheduleComponent],
  template: `<div class="mt-2"><sk-schedule /></div>`,
})
export class CourseScheduleComponent {
  public course_id = input<string>();
}
