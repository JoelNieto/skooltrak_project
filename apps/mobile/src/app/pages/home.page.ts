import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { mobileStore } from '@skooltrak/store';

import { PictureComponent } from '../components/picture/picture.component';
import { CoursesStore } from './courses/courses.store';
import { SchoolConnectorPage } from './school/school-connector.page';

@Component({
  standalone: true,
  selector: 'skooltrak-home',
  providers: [CoursesStore],
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
    IonRadioGroup,
    IonRadio,
    IonMenuButton,
    PictureComponent,
    TranslateModule,
    FormsModule,
    RouterLink,
  ],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title> {{ auth.selectedSchool()?.short_name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content id="main-content" [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            {{ auth.selectedSchool()?.short_name }}</ion-title
          >
        </ion-toolbar>
      </ion-header>
      @for (course of store.courses(); track course.id) {
        <ion-card
          button="true"
          [routerLink]="'course'"
          [queryParams]="{ course_id: course.id }"
          routerDirection="forward"
        >
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
    <ion-menu contentId="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ 'SCHOOL_CONNECTOR.TITLE' | translate }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding-vertical">
        <ion-list>
          <ion-radio-group
            [ngModel]="auth.schoolId()"
            (ionChange)="changeSchool($event.target.value)"
          >
            @for (school of auth.schools(); track school.id) {
              <ion-item lines="full">
                <ion-avatar aria-hidden="true" slot="start">
                  <skooltrak-picture
                    bucket="crests"
                    [pictureURL]="school.crest_url ?? 'default_avatar.jpg'"
                  /> </ion-avatar
                ><ion-radio [value]="school.id">{{
                  school.short_name
                }}</ion-radio></ion-item
              >
            }
          </ion-radio-group>
        </ion-list>
        <ion-button
          color="secondary"
          class="ion-margin"
          expand="block"
          (click)="connectToSchool()"
          >{{ 'SCHOOL_CONNECTOR.CONNECT' | translate }}</ion-button
        >
      </ion-content>
    </ion-menu>
  `,
})
export class HomePage {
  public store = inject(CoursesStore);
  public auth = inject(mobileStore.AuthStore);
  private modalCtrl = inject(ModalController);

  public changeSchool(schoolId: string): void {
    patchState(this.auth, { schoolId });
  }

  public async connectToSchool(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SchoolConnectorPage,
    });

    await modal.present();
  }
}
