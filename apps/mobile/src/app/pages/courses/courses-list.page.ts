import { Component, inject } from '@angular/core';
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
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { mobileStore } from '@skooltrak/store';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';

import { LoadingComponent } from '../../components/loading/loading.component';
import { PictureComponent } from '../../components/picture/picture.component';
import { CoursesStore } from './courses.store';

@Component({
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    LoadingComponent,
    TranslateModule,
    PictureComponent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonCardSubtitle,
    RouterLink,
    IonGrid,
    IonCol,
    IonRow,
    IonButton,
    IonButtons,
    IonIcon,
    IonText,
    IonChip,
    IonAvatar,
    IonLabel,
    IonRefresher,
    IonRefresherContent,
  ],
  selector: 'skooltrak-courses-list',
  styles: `
  .header-avatar {
    padding: .5rem;
  }
  `,
  template: ` <ion-header translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-title>{{ 'COURSES.TITLE' | translate }} </ion-title>
        <ion-buttons slot="primary">
          <ion-avatar class="header-avatar">
            <skooltrak-picture
              bucket="avatars"
              rounded
              [fileName]="auth.user()?.avatar_url ?? 'default_avatar.jpg'"
            />
          </ion-avatar>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true">
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content />
      </ion-refresher>
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            {{ 'COURSES.TITLE' | translate }}
          </ion-title>
        </ion-toolbar>
      </ion-header>

      @for (course of store.courses(); track course.id) {
        <ion-card routerLink="details" [queryParams]="{ course_id: course.id }">
          <skooltrak-picture
            bucket="courses"
            [fileName]="course.picture_url!"
          ></skooltrak-picture>
          <ion-card-header>
            <ion-card-title>
              {{ course.subject?.name }}
            </ion-card-title>
            @if (!store.isStudent()) {
              <ion-card-subtitle>{{ course.plan.name }}</ion-card-subtitle>
            }
          </ion-card-header>
          @if (!store.isTeacher() && course.teachers.length) {
            <ion-card-content>
              @for (teacher of course.teachers; track teacher.id) {
                <ion-chip color="primary">
                  <ion-avatar aria-hidden="true">
                    <skooltrak-picture
                      bucket="avatars"
                      rounded
                      [fileName]="teacher.avatar_url ?? 'default_avatar.jpg'"
                    />
                  </ion-avatar>
                  <ion-label
                    >{{ teacher.first_name }}
                    {{ teacher.father_name }}</ion-label
                  >
                </ion-chip>
              }
            </ion-card-content>
          }
        </ion-card>
      } @empty {
        @if (store.loading()) {
          <skooltrak-loading type="card" />
        } @else if (store.error()) {
          <ion-grid>
            <ion-row class="ion-justify-content-center ion-align-items-center">
              <ion-col size="2" class="ion-align-self-center ion-text-center">
                <ion-icon name="close-circle" color="danger" size="large" />
              </ion-col>
            </ion-row>
            <ion-row class="ion-justify-content-center">
              <ion-col class="ion-align-self-center">
                <ion-text color="medium"
                  ><p class="ion-text-center">
                    {{ 'ACTIONS.ERROR' | translate }}
                  </p>
                </ion-text>
              </ion-col>
            </ion-row>
            <ion-row class="ion-justify-content-center">
              <ion-col size="6" class="ion-align-self-center">
                <ion-button
                  color="danger"
                  shape="round"
                  expand="block"
                  (click)="store.fetchCourses()"
                  >{{ 'ACTIONS.RELOAD' | translate }}</ion-button
                >
              </ion-col>
            </ion-row>
          </ion-grid>
        } @else {
          No items
        }
      }
    </ion-content>`,
})
export class CoursesListPage {
  public readonly store = inject(CoursesStore);
  public readonly auth = inject(mobileStore.AuthStore);
  constructor() {
    addIcons({ closeCircle });
  }

  public handleRefresh(event: RefresherCustomEvent): void {
    setTimeout(async () => {
      await this.store.fetchCourses();
      event.target.complete();
    }, 1000);
  }
}
