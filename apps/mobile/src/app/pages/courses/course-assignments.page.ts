import { Component } from '@angular/core';
import { IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  imports: [IonTitle, IonHeader, IonToolbar],
  selector: 'skooltrak-course-assignments',
  template: `<ion-header class="ion-no-border"
    ><ion-toolbar>
      <ion-title>Vakue</ion-title>
    </ion-toolbar></ion-header
  > `,
})
export class CourseAssignmentsPage {}
