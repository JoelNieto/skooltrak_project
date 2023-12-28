import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'skooltrak-profile-edit',
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    TranslateModule,
    IonButton,
    IonButtons,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button (click)="modalCtrl.dismiss()">
            {{ 'CHAT.CANCEL' | translate }}
          </ion-button>
        </ion-buttons>
        <ion-title>{{ 'PROFILE.TITLE' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content> </ion-content>
  `,
})
export class ProfileEditPage {
  public readonly modalCtrl = inject(ModalController);
}
