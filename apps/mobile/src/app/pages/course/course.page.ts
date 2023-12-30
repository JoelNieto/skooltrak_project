import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonLabel,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';

import { CourseStore } from './course.store';

@Component({
  standalone: true,
  providers: [CourseStore],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    TranslateModule,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
  ],
  template: `<ion-header [translucent]="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button />
        </ion-buttons>
        <ion-title> {{ store.details()?.subject?.name }} </ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment
          color="primary"
          value="assignments"
          (ionChange)="changeSegment($event)"
        >
          <ion-segment-button value="assignments">
            <ion-label>{{ 'ASSIGNMENTS.TITLE' | translate }}</ion-label>
          </ion-segment-button>
          <ion-segment-button value="grades">
            <ion-label>{{ 'GRADES.TITLE' | translate }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar> </ion-header
    ><ion-content fullscreen="true" class="ion-padding-horizontal">
      @if (store.loading()) {
      } @else {
        @switch (currentSegment()) {
          @case ('assignments') {
            <h1>{{ 'ASSIGNMENTS.TITLE' | translate }}</h1>
            <ion-datetime-button datetime="date" />

            <ion-modal [keepContentsMounted]="true">
              <ng-template>
                <ion-datetime id="date" presentation="date" />
              </ng-template>
            </ion-modal>
            <ion-datetime-button datetime="date2" />

            <ion-modal [keepContentsMounted]="true">
              <ng-template>
                <ion-datetime id="date2" presentation="date" />
              </ng-template>
            </ion-modal>
          }
          @case ('grades') {
            <h1>{{ 'GRADES.TITLE' | translate }}</h1>
          }
        }
      }
    </ion-content>`,
})
export class CoursePage implements OnInit {
  public store = inject(CourseStore);
  private route = inject(ActivatedRoute);
  public currentSegment = signal('assignments');

  public ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: ({ course_id }) => {
        patchState(this.store, { courseId: course_id });
      },
    });
  }

  public changeSegment(ev: CustomEvent): void {
    this.currentSegment.set(ev.detail.value);
  }
}
