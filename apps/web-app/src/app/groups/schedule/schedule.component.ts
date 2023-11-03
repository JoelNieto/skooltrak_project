import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sk-groups-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `<p>schedule works!</p>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsScheduleComponent {}
