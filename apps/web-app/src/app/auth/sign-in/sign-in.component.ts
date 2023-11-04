import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sk-sign-in',
  standalone: true,
  imports: [CommonModule],
  template: `<p>sign-in works!</p>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {}
