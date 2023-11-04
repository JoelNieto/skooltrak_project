import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sk-students',
  standalone: true,
  imports: [CommonModule],
  template: `<p>students works!</p>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsComponent {}
