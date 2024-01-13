import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  standalone: true,
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
          color="tertiary"
          value="assignments"
          (ionChange)="changeSegment($event)"
        >
          <ion-segment-button value="assignments">
            {{ 'COURSES.ASSIGNMENTS' | translate }}</ion-segment-button
          >
          <ion-segment-button value="grades">
            {{ 'COURSES.GRADES' | translate }}</ion-segment-button
          >
        </ion-segment>
      </ion-toolbar> </ion-header
    ><ion-content>
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
  ],
})
export class CourseDetailsPage {
  public store = inject(CoursesStore);
  private route = inject(ActivatedRoute);
  public currentSegment = signal('assignments');
  constructor() {
    addIcons({ checkboxOutline, starOutline });
  }

  public ionViewWillEnter(): void {
    this.route.queryParams.subscribe({
      next: ({ course_id }) => {
        patchState(this.store, { selectedId: course_id });
      },
    });
  }

  public changeSegment(ev: CustomEvent): void {
    this.currentSegment.set(ev.detail.value);
  }
}
