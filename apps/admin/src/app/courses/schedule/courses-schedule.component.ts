import { Component } from '@angular/core';
import { CalendarComponent } from '@skooltrak/ui';

@Component({
  standalone: true,
  imports: [CalendarComponent],
  template: `<sk-calendar />`,
})
export class CoursesScheduleComponent {}
