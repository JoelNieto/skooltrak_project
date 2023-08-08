import { Component } from '@angular/core';
import { CalendarComponent } from '@skooltrak/ui';

@Component({
  standalone: true,
  selector: 'sk-schedule',
  imports: [CalendarComponent],
  template: `<sk-calendar />`,
})
export class ScheduleComponent {}
