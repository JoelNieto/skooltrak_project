import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sk-groups-grades',
  standalone: true,
  imports: [CommonModule],
  template: `<p>grades works!</p>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsGradesComponent {}
