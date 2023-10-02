import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'sk-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  styles: [
    `
      main {
        min-height: calc(100vh - 4rem);
      }
    `,
  ],
  template: `<sk-navbar />
    <main
      class="relative top-14 flex flex-col items-center bg-gray-50 p-8 font-sans dark:bg-gray-900"
    >
      <div class="w-full max-w-7xl">
        <router-outlet />
      </div>
    </main> `,
})
export class AppComponent {}
