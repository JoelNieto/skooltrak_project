import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sk-groups-students',
  standalone: true,
  imports: [CommonModule],
  template: `<p>students works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsComponent {}
