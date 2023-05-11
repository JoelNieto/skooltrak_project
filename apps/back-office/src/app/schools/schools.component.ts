import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';

import { SchoolsStore } from './schools.store';

@Component({
  selector: 'skooltrak-schools',
  imports: [RouterOutlet],
  standalone: true,
  providers: [provideComponentStore(SchoolsStore)],
  template: ` <h2
      class="leading-tight tracking-tight text-gray-700 dark:text-white text-3xl font-mono font-bold mb-2"
    >
      Schools
    </h2>
    <router-outlet />`,
})
export class SchoolsComponent {}
