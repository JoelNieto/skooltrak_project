import { Component, inject, input, signal } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonIcon,
  IonLabel,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { checkboxOutline, starOutline } from 'ionicons/icons';

import { CourseAssignmentsPage } from './course-assignments.page';
import { CourseGradesPage } from './course-grades.page';
import { CoursesStore } from './courses.store';

@Component({
    selector: 'skooltrak-course',
    template: `<ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs" />
        </ion-buttons>
        <ion-title> {{ store.selected()?.subject?.name }} </ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment
          color="secondary"
          value="assignments"
          (ionChange)="changeSegment($event)"
        >
          <ion-segment-button value="news">
            {{ 'COURSES.NEWS' | translate }}</ion-segment-button
          >
          <ion-segment-button value="assignments">
            {{ 'COURSES.ASSIGNMENTS' | translate }}</ion-segment-button
          >
          <ion-segment-button value="grades">
            {{ 'COURSES.GRADES' | translate }}</ion-segment-button
          >
        </ion-segment>
      </ion-toolbar> </ion-header
    ><ion-content scrollY="false">
      @switch (currentSegment()) {
        @case ('assignments') {
          <skooltrak-course-assignments />
        }
        @case ('grades') {
          <skooltrak-course-grades />
        }
      }
    </ion-content>`,
    imports: [
        IonContent,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonBackButton,
        TranslateModule,
        IonIcon,
        IonLabel,
        IonSegment,
        IonSegmentButton,
        IonDatetime,
        IonDatetimeButton,
        IonModal,
        CourseAssignmentsPage,
        CourseGradesPage,
    ]
})
export class CourseDetailsPage {
  private course_id = input<string>();
  public store = inject(CoursesStore);
  public currentSegment = signal('assignments');
  constructor() {
    addIcons({ checkboxOutline, starOutline });
  }

  public ionViewWillEnter(): void {
    patchState(this.store, { selectedId: this.course_id() });
  }

  public ionViewWillLeave(): void {
    patchState(this.store, { selectedId: undefined });
  }

  public changeSegment(ev: CustomEvent): void {
    this.currentSegment.set(ev.detail.value);
  }
}
