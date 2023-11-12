import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sk-password-reset',
  standalone: true,
  imports: [CommonModule],
  template: `<p>password-reset works!</p>`,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordResetComponent {}
