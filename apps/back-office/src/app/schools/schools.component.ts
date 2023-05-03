import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'skooltrak-schools',
  imports: [RouterOutlet],
  standalone: true,
  template: ` <router-outlet />`,
})
export class SchoolsComponent {}
