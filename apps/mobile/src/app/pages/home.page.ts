import { Component, inject } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

import { PictureComponent } from '../components/picture/picture.component';
import { HomeStore } from './home.store';

@Component({
  standalone: true,
  selector: 'skooltrak-home',
  providers: [HomeStore],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    PictureComponent,
    TranslateModule,
  ],
  template: `<ion-header>
      <ion-toolbar>
        <ion-title> {{ 'HOME' | translate }} </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large"> {{ 'HOME' | translate }}</ion-title>
        </ion-toolbar>
      </ion-header>
      @for (course of store.courses(); track course.id) {
        <ion-card>
          <skooltrak-picture
            bucket="courses"
            [pictureURL]="course.picture_url!"
          ></skooltrak-picture>
          <ion-card-header>
            <ion-card-title>{{ course.subject?.name }}</ion-card-title>
            <ion-card-subtitle>{{ course.plan.name }}</ion-card-subtitle>
          </ion-card-header>
        </ion-card>
      }
    </ion-content> `,
})
export class HomePage {
  public store = inject(HomeStore);
}
