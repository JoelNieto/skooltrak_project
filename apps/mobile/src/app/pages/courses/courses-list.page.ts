import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

import { PictureComponent } from '../../components/picture/picture.component';
import { CoursesStore } from './courses.store';

@Component({
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    TranslateModule,
    PictureComponent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    RouterLink,
  ],
  selector: 'skooltrak-list',
  template: ` <ion-header translucent="true">
      <ion-toolbar>
        <ion-title>{{ 'COURSES.TITLE' | translate }} </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            {{ 'COURSES.TITLE' | translate }}
          </ion-title>
        </ion-toolbar>
      </ion-header>
      @if (store.loading()) {
      } @else {
        @for (course of store.courses(); track course.id) {
          <ion-card
            routerLink="details"
            [queryParams]="{ course_id: course.id }"
          >
            <skooltrak-picture
              bucket="courses"
              [pictureURL]="course.picture_url!"
            ></skooltrak-picture>
            <ion-card-header>
              <ion-card-title>
                {{ course.subject?.name }}
              </ion-card-title>
              <ion-card-subtitle>{{ course.plan.name }}</ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        }
      }
    </ion-content>`,
})
export class CoursesListPage {
  public readonly store = inject(CoursesStore);
}
