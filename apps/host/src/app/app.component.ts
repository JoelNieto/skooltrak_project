import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'skooltrak-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: ` <ul class="remote-menu">
      <li><a routerLink="/">Home</a></li>
      <li><a routerLink="admin">Admin</a></li>
      <li><a routerLink="student">Student</a></li>
      <li><a routerLink="teacher">Teacher</a></li>
    </ul>
    <router-outlet />`,
  styles: [``],
})
export class AppComponent {
  title = 'host';
}
