import { Component, inject } from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { mobileAuthState } from '@skooltrak/store';

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
    IonMenu,
    IonButton,
    IonButtons,
    IonList,
    IonLabel,
    IonAvatar,
    IonItem,
    IonMenuButton,
    PictureComponent,
    TranslateModule,
  ],
  template: `
    <ion-menu contentId="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menu Content</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-list>
          @for (school of auth.SCHOOLS(); track school.id) {
            <ion-item lines="full">
              <ion-avatar aria-hidden="true" slot="start">
                <skooltrak-picture
                  bucket="crests"
                  [pictureURL]="school.crest_url ?? 'default_avatar.jpg'"
                /> </ion-avatar
              ><ion-label>{{ school.short_name }}</ion-label></ion-item
            >
          }
        </ion-list>
      </ion-content>
    </ion-menu>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title> {{ auth.SCHOOL()?.short_name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content id="main-content">
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
    </ion-content>
  `,
})
export class HomePage {
  public store = inject(HomeStore);
  public auth = inject(mobileAuthState.MobileAuthFacade);
}
