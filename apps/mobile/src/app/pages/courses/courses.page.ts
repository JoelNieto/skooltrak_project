import { Component, inject } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';

import { CoursesStore } from './courses.store';

@Component({
  standalone: true,
  selector: 'skooltrak-courses',
  providers: [CoursesStore],
  imports: [IonRouterOutlet],
  template: `<ion-router-outlet />`,
})
export class CoursesPage {
  private readonly store = inject(CoursesStore);
  public ionViewDidEnter(): void {
    this.store.fetchCourses();
  }
}
