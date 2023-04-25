import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from '@skooltrak/ui';

@Component({
  selector: 'skooltrak-admin',
  standalone: true,
  imports: [DashboardComponent, RouterOutlet],
  template: `
    <skooltrak-dashboard>
      <div class="container" content><router-outlet /></div>
    </skooltrak-dashboard>
  `,
  styles: [],
})
export class AdminComponent {}
