import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sk-mat-quill',
  standalone: true,
  imports: [CommonModule],
  template: `<p>mat-quill works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatQuillComponent {}
