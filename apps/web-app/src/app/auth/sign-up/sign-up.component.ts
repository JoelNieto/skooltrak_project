import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sk-sign-up',
  standalone: true,
  imports: [CommonModule],
  template: `<p>sign-up works!</p>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {}
