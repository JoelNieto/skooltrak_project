import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sk-archived',
  standalone: true,
  imports: [CommonModule],
  template: `<p>archived works!</p>`,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchivedComponent {}
