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
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { format } from 'date-fns';

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
    ReactiveFormsModule,
  ],
  providers: [ScheduleStore],
  template: `<ion-header>
      <ion-toolbar>
        <ion-title> {{ 'SCHEDULE' | translate }}</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-grid>
          <ion-row>
            <ion-col class="ion-align-self-center">
              <ion-datetime [formControl]="dateControl" presentation="date" />
            </ion-col>
          </ion-row>
        </ion-grid> </ion-toolbar></ion-header
    ><ion-content class="ion-padding">
      <ion-list>
        @for (assignment of store.assignments(); track assignment.id) {
          <ion-item>
            <ion-label>
              <h2>
                {{ assignment.title }}
              </h2>
              <p>{{ assignment.subject_name }}</p>
            </ion-label>
            <ion-note color="primary">
              {{ assignment.type }}
            </ion-note>
          </ion-item>
        }
      </ion-list>
    </ion-content>`,
})
export class SchedulePage implements OnInit {
  public store = inject(ScheduleStore);
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
}
