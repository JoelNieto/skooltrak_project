import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';

import { SchoolsStore } from './schools.store';

@Component({
  selector: 'skooltrak-schools',
  imports: [RouterOutlet],
  standalone: true,
  providers: [provideComponentStore(SchoolsStore)],
  template: `
    <h2
      class=" sticky top-0 bg-white dark:bg-gray-800 pb-3 leading-tight tracking-tight flex text-gray-700 dark:text-white text-3xl font-mono font-bold mb-2"
    >
      Schools
    </h2>
    <router-outlet />
  `,
})
export class SchoolsComponent {}
