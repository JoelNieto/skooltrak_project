import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';

import { SubjectsStore } from './subjects.store';

@Component({
  standalone: true,
  selector: 'skooltrak-subjects',
  imports: [RouterOutlet],
  template: `<h2
      class=" sticky top-0 bg-white dark:bg-gray-800 pb-3 leading-tight tracking-tight text-gray-700 dark:text-white text-3xl font-mono font-bold mb-2"
    >
      Subjects
    </h2>
    <router-outlet />`,
  styles: [],
  providers: [provideComponentStore(SubjectsStore)],
})
export class SubjectsComponents {}
