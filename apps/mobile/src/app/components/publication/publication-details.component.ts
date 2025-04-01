import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { PublicationObject } from '@skooltrak/models';

import { PictureComponent } from '../picture/picture.component';

@Component({
    selector: 'skooltrak-publication-details',
    imports: [
        TranslateModule,
        IonContent,
        IonHeader,
        IonButtons,
        IonText,
        IonButton,
        IonTitle,
        IonToolbar,
        IonList,
        IonItem,
        DatePipe,
        IonIcon,
        IonChip,
        IonAvatar,
        IonLabel,
        PictureComponent,
    ],
    template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>{{ 'PUBLICATIONS.DETAILS' | translate }}</ion-title>
        <ion-buttons slot="end">
          <ion-button color="primary" (click)="modalCtrl.dismiss()">
            {{ 'DONE' | translate }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true" class="ion-padding">
      <ion-text color="primary">
        <h1>{{ publication.title }}</h1>
      </ion-text>
      <ion-text>
        <p>
          <ion-chip color="secondary">
            <ion-avatar aria-hidden="true">
              <skooltrak-picture
                bucket="avatars"
                rounded
                [fileName]="publication.user.avatar_url ?? 'default_avatar.jpg'"
              />
            </ion-avatar>
            <ion-label
              >{{ publication.user.first_name }}
              {{ publication.user.father_name }}</ion-label
            >
          </ion-chip>
        </p>
      </ion-text>
      <ion-text color="medium">
        <p>{{ publication.created_at | date: 'medium' }}</p>
      </ion-text>
      <ion-text>
        <p [innerText]="publication.body"></p>
      </ion-text>
    </ion-content>
  `
})
export class PublicationsDetailsComponent {
  public publication!: PublicationObject;
  public modalCtrl = inject(ModalController);
}
