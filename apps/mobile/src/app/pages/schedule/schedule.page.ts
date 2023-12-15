import { Component } from '@angular/core';
import { IonContent, IonDatetime, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonDatetime,
  ],
  template: `<ion-header>
      <ion-toolbar>
        <ion-title size="large"> {{ 'SCHEDULE' | translate }}</ion-title>
      </ion-toolbar> </ion-header
    ><ion-content class="ion-padding">
      <ion-datetime></ion-datetime>
    </ion-content>`,
})
export class SchedulePage {}
