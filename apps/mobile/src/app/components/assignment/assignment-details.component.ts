import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { AssignmentView } from '@skooltrak/models';
import { addIcons } from 'ionicons';
import { cloudUploadOutline } from 'ionicons/icons';

@Component({
    selector: 'skooltrak-assignment-details',
    imports: [
        IonContent,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonFooter,
        IonText,
        TranslateModule,
        IonList,
        IonGrid,
        IonRow,
        IonCol,
        IonItem,
        IonLabel,
        IonNote,
        DatePipe,
        IonButton,
        IonButtons,
        IonIcon,
    ],
    template: ` <ion-header translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button (click)="modalCtrl.dismiss()" color="primary">
            {{ 'DONE' | translate }}
          </ion-button>
        </ion-buttons>
        <ion-title>{{ 'ASSIGNMENTS.DETAILS' | translate }}</ion-title>
      </ion-toolbar> </ion-header
    ><ion-content fullscreen="true" color="light">
      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large">{{
            'ASSIGNMENTS.DETAILS' | translate
          }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-list inset="true">
        <ion-item>
          <ion-label
            ><h2>{{ 'ASSIGNMENTS.ITEM_TITLE' | translate }}</h2></ion-label
          >
          <ion-note>{{ assignment.title }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label
            ><h2>{{ 'ASSIGNMENTS.TYPE' | translate }}</h2></ion-label
          >
          <ion-note>{{ assignment.type }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label
            ><h2>{{ 'SUBJECTS.LABEL' | translate }}</h2></ion-label
          >
          <ion-note>{{ assignment.subject_name }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label
            ><h2>{{ 'ASSIGNMENTS.PLAN' | translate }}</h2></ion-label
          >
          <ion-note>{{ assignment.plan_name }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label
            ><h2>{{ 'ASSIGNMENTS.DATE' | translate }}</h2></ion-label
          >
          <ion-note>{{ assignment.date | date: 'fullDate' }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label
            ><h2>{{ 'ASSIGNMENTS.TEACHER' | translate }}</h2></ion-label
          >
          <ion-note>{{ assignment.user_name }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label
            ><h2>{{ 'ASSIGNMENTS.CREATED' | translate }}</h2></ion-label
          >
          <ion-note>{{ assignment.created_at | date: 'medium' }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label
            ><h2>{{ 'ASSIGNMENTS.INSTRUCTIONS' | translate }}</h2>
            <ion-note
              color="medium"
              class="ion-margin-horizontal"
              [innerHTML]="assignment.description"
          /></ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
    @if (assignment.upload_file) {
      <ion-footer class="ion-no-border">
        <ion-toolbar>
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-button expand="block" color="tertiary" shape="round">
                  <ion-icon name="cloud-upload-outline" slot="start" />
                  {{ 'ASSIGNMENTS.UPLOAD_FILE' | translate }}</ion-button
                >
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-toolbar>
      </ion-footer>
    }`
})
export class AssignmentDetailsPage {
  public assignment!: AssignmentView;
  public modalCtrl = inject(ModalController);
  constructor() {
    addIcons({ cloudUploadOutline });
  }
}
