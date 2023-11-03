import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'sk-host',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  standalone: true,
})
export class HostComponent {}
