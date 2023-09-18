import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';

import { CoursesStore } from './courses.store';

@Component({
  standalone: true,
  selector: 'sk-courses',
  imports: [RouterOutlet],
  providers: [provideComponentStore(CoursesStore)],
  template: ` <router-outlet /> `,
})
export class CoursesComponent {}
