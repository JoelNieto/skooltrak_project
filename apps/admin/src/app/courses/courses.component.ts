import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { UtilService } from '@skooltrak/ui';

import { CoursesStore } from './courses.store';

@Component({
  selector: 'sk-admin-courses',
  standalone: true,
  imports: [RouterOutlet],
  providers: [provideComponentStore(CoursesStore), UtilService],
  template: `<router-outlet />`,
})
export class CoursesComponent {}
