import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AlertController,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonRouterOutlet,
  IonRow,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { mobileStore } from '@skooltrak/store';
import { addIcons } from 'ionicons';
import {
  businessOutline,
  calendarOutline,
  createOutline,
  documentTextOutline,
  mailOutline,
} from 'ionicons/icons';

import { PictureComponent } from '../../components/picture/picture.component';
import { SchoolConnectorPage } from '../school/school-connector.page';
import { ProfileEditPage } from './profile-edit.page';

@Component({
  standalone: true,
  selector: 'skooltrak-profile',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSearchbar,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonAvatar,
    IonList,
    IonListHeader,
    IonIcon,
    PictureComponent,
    TranslateModule,
    IonLabel,
    IonItem,
    IonNote,
    IonButton,
    IonButtons,
    DatePipe,
    SchoolConnectorPage,
  ],
  styles: [
    `
      ion-avatar {
        height: 3.5rem;
        width: 3.5rem;
      }
      ion-header {
        ion-toolbar {
          --border-width: 0;
        }
      }
    `,
  ],
  template: `
    <ion-header [translucent]="true" class="ion-no-border">
      <ion-toolbar>
        <ion-title>
          {{ 'PROFILE.NAME' | translate }}
        </ion-title>
        <ion-buttons slot="primary">
          <ion-button color="primary" (click)="editProfile()">
            {{ 'EDIT' | translate }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content [fullscreen]="true" color="light">
      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large">
            {{ 'PROFILE.NAME' | translate }}
          </ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-list inset="true">
        <ion-item>
          <ion-avatar slot="start">
            <skooltrak-picture
              bucket="avatars"
              rounded
              [fileName]="auth.user()?.avatar_url ?? 'default_avatar.jpg'"
            />
          </ion-avatar>
          <ion-label color="tertiary">
            <h1>
              {{ auth.user()?.first_name }} {{ auth.user()?.father_name }}
            </h1>
            <p>
              Last update: {{ auth.user()?.updated_at | date: 'shortDate' }}
            </p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-list [inset]="true">
        <ion-item>
          <ion-icon name="mail-outline" slot="start" color="medium" />
          <ion-label>{{ auth.user()?.email }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon name="calendar-outline" slot="start" color="medium" />
          <ion-label>{{
            auth.user()?.birth_date | date: 'mediumDate'
          }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon name="document-text-outline" slot="start" color="medium" />
          <ion-label>{{ auth.user()?.document_id }}</ion-label>
        </ion-item>
      </ion-list>
      <ion-list inset="true">
        @for (profile of auth.profiles(); track profile) {
          <ion-item>
            <ion-icon name="business-outline" slot="start" color="medium" />
            <ion-label
              ><h3>{{ profile.school.short_name }}</h3>
              <p>{{ 'PEOPLE.' + profile.role | translate }}</p></ion-label
            >
            <ion-note>{{ auth.group()?.name }}</ion-note>
          </ion-item>
        }
      </ion-list>
      <ion-button
        color="primary"
        class="ion-margin"
        expand="block"
        shape="round"
        fill="outline"
        (click)="connectToSchool()"
        >{{ 'SCHOOL_CONNECTOR.CONNECT' | translate }}</ion-button
      >
      <ion-button
        (click)="signOut()"
        expand="block"
        color="secondary"
        class="ion-margin"
        shape="round"
        >{{ 'SIGN_OUT.TITLE' | translate }}</ion-button
      >
    </ion-content>
  `,
})
export class ProfilePage {
  public auth = inject(mobileStore.AuthStore);
  private alertCtrl = inject(AlertController);
  private modalCtrl = inject(ModalController);
  private ionRouterOutlet = inject(IonRouterOutlet);
  private translate = inject(TranslateService);
  constructor() {
    addIcons({
      mailOutline,
      calendarOutline,
      businessOutline,
      createOutline,
      documentTextOutline,
    });
  }

  public async signOut(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('SIGN_OUT.TITLE'),
      subHeader: this.translate.instant('SIGN_OUT.TEXT'),
      backdropDismiss: false,
      buttons: [
        {
          text: this.translate.instant('CONFIRMATION.CANCEL'),
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (): void => {
            this.auth.signOut();
          },
        },
      ],
    });
    await alert.present();
  }

  public async editProfile(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ProfileEditPage,
      presentingElement: this.ionRouterOutlet.nativeEl,
    });
    await modal.present();
  }

  public async connectToSchool(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SchoolConnectorPage,
    });

    await modal.present();
  }
}
