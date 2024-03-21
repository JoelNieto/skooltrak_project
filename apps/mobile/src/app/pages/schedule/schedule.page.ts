import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  IonCol,
  IonContent,
  IonDatetime,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { AssignmentView } from '@skooltrak/models';
import { webStore } from '@skooltrak/store';
import { format } from 'date-fns';

import { AssignmentDetailsPage } from '../../components/assignment/assignment-details.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ScheduleStore } from './schedule.store';

@Component({
  standalone: true,
  imports: [
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonDatetime,
    IonList,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel,
    IonNote,
    IonText,
    ReactiveFormsModule,
    AssignmentDetailsPage,
    LoadingComponent,
  ],
  providers: [ScheduleStore],
  template: `<ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-title size="large">
          {{ 'SCHEDULE' | translate }}
        </ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col class="ion-align-self-center" size="11">
              <ion-datetime
                [formControl]="dateControl"
                presentation="date"
                locale="es-MX"
              />
            </ion-col>
          </ion-row>
        </ion-grid> </ion-toolbar></ion-header
    ><ion-content>
      <ion-list>
        @for (assignment of store.assignments(); track assignment.id) {
          <ion-item (click)="showAssignment(assignment)">
            <ion-label>
              <h2 color="tertiary">
                {{ assignment.title }}
              </h2>
              <p>{{ assignment.subject_name }}</p>
              @if (auth.isAdmin() || auth.isTeacher()) {
                <ion-text color="tertiary">
                  <p>{{ assignment.group_name }}</p>
                </ion-text>
              }
            </ion-label>
            <ion-note color="primary">
              {{ assignment.type }}
            </ion-note>
          </ion-item>
        } @empty {
          @if (store.loading()) {
            <skooltrak-loading type="items" />
          }
        }
      </ion-list>
    </ion-content>`,
})
export class SchedulePage implements OnInit {
  public store = inject(ScheduleStore);
  public auth = inject(webStore.AuthStore);
  private modalCtrl = inject(ModalController);
  public dateControl = new FormControl(format(new Date(), 'yyyy-MM-dd'), {
    nonNullable: true,
  });

  public ngOnInit(): void {
    this.dateControl.valueChanges.subscribe({
      next: (date) => {
        patchState(this.store, { date });
      },
    });
  }

  public async showAssignment(assignment: AssignmentView): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AssignmentDetailsPage,
      componentProps: { assignment },
    });
    modal.present();
  }
}
