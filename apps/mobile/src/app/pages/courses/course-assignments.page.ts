import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { AssignmentView } from '@skooltrak/models';
import { addIcons } from 'ionicons';
import { chevronBack, chevronForward } from 'ionicons/icons';

import { AssignmentDetailsPage } from '../../components/assignment/assignment-details.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CourseAssignmentStore } from './course-assignments.store';

@Component({
  standalone: true,
  imports: [
    IonTitle,
    IonContent,
    IonHeader,
    IonToolbar,
    DatePipe,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    DatePipe,
    AssignmentDetailsPage,
    LoadingComponent,
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
    ><ion-content>
      <ion-list>
        @for (assignment of store.assignments(); track assignment.id) {
          <ion-item (click)="showAssignment(assignment)">
            <ion-label>
              <h2>{{ assignment.title }}</h2>
              <p>{{ assignment.date | date: 'fullDate' }}</p>
            </ion-label>
            <ion-note color="secondary">{{ assignment.type }}</ion-note>
          </ion-item>
        } @empty {
          @if (store.loading()) {
            <skooltrak-loading type="items" />
          }
        }
      </ion-list>
    </ion-content> `,
})
export class CourseAssignmentsPage {
  public store = inject(CourseAssignmentStore);
  public modalCtrl = inject(ModalController);

  constructor() {
    addIcons({ chevronBack, chevronForward });
  }

  public async showAssignment(assignment: AssignmentView): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AssignmentDetailsPage,
      componentProps: { assignment },
    });

    modal.present();
  }
}
