import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from '@skooltrak/ui';

@Component({
  selector: 'skooltrak-host',
  imports: [DashboardComponent, RouterOutlet],
  template: `<router-outlet />`,
  standalone: true,
})
export class HostComponent {}