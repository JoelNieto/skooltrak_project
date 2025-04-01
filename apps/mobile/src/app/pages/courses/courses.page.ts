import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';

import { CoursesStore } from './courses.store';

@Component({
    selector: 'skooltrak-courses',
    providers: [CoursesStore],
    imports: [IonRouterOutlet],
    template: `<ion-router-outlet />`
})
export class CoursesPage {}
