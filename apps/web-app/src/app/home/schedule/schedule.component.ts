import { Component, Input, OnInit } from '@angular/core';
import { CalendarComponent } from '@skooltrak/ui';

@Component({
  standalone: true,
  selector: 'sk-schedule',
  imports: [CalendarComponent],
  template: `<sk-calendar [query_value]="course_id!" />`,
})
export class ScheduleComponent implements OnInit {
  @Input() course_id?: string;

  ngOnInit(): void {
    console.info(this.course_id);
  }
}
