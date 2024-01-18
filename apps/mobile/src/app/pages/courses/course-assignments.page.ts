import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBack, chevronForward } from 'ionicons/icons';

import { CourseAssignmentStore } from './course-assignment.store';

@Component({
  standalone: true,
  imports: [
    IonTitle,
    IonHeader,
    IonToolbar,
    DatePipe,
    IonButtons,
    IonButton,
    IonIcon,
  ],
  selector: 'skooltrak-course-assignments',
  styles: `
    ion-toolbar {
      --ion-safe-area-top: 0;
    }
  `,
  providers: [CourseAssignmentStore],
  template: `<ion-header class="ion-no-border"
    ><ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="secondary" (click)="store.previousWeek()"
          ><ion-icon name="chevron-back"
        /></ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button color="secondary" (click)="store.nextWeek()"
          ><ion-icon name="chevron-forward"
        /></ion-button>
      </ion-buttons>
      <ion-title
        >{{ store.startDate() | date: 'shortDate' }} -
        {{ store.endDate() | date: 'shortDate' }}
      </ion-title>
    </ion-toolbar></ion-header
  > `,
})
export class CourseAssignmentsPage {
  public store = inject(CourseAssignmentStore);

  constructor() {
    addIcons({ chevronBack, chevronForward });
  }
}
