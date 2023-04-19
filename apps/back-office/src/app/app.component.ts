import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'skooltrak-root',
  template: `<skooltrak-nx-welcome></skooltrak-nx-welcome>
    <router-outlet></router-outlet>`,
  styles: [''],
})
export class AppComponent {
  title = 'back-office';
}
