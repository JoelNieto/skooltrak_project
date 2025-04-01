import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CoursesStore } from './courses.store';

@Component({
    selector: 'sk-courses',
    imports: [RouterOutlet],
    providers: [CoursesStore],
    template: ` <router-outlet /> `
})
export class CoursesComponent {}
