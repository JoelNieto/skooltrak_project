import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'sk-root',
  template: `<h1>Welcome onboarding</h1>
    <router-outlet></router-outlet>`,
  styles: [''],
})
export class AppComponent {}
