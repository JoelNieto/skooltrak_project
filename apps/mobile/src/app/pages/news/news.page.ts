import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  InfiniteScrollCustomEvent,
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { PublicationObject } from '@skooltrak/models';
import { mobileStore } from '@skooltrak/store';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

import { PictureComponent } from '../../components/picture/picture.component';
import { PublicationsDetailsComponent } from '../../components/publication/publication-details.component';
import { PublicationFormComponent } from '../../components/publication/publication-form.component';
import { NewsStore } from './news.store';

@Component({
  standalone: true,
  selector: 'skooltrak-news',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    TranslateModule,
    IonFab,
    IonIcon,
    IonFabButton,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonFooter,
    IonRow,
    IonCol,
    DatePipe,
    IonChip,
    IonAvatar,
    PictureComponent,
    IonLabel,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSearchbar,
    IonItem,
  ],
  providers: [NewsStore],
  styles: `
    .text-preview {
      height: 2.5rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    ion-card-title {
      max-height: 2rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  `,
  template: `<ion-header class="ion-no-border">
      <ion-toolbar color="primary"
        ><ion-title size="large">{{ 'NEWS.TITLE' | translate }}</ion-title>
      </ion-toolbar>
      <ion-toolbar color="primary">
        <ion-searchbar
          inputmode="search"
          animated="true"
          [placeholder]="'ACTIONS.SEARCH' | translate"
        />
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true">
      @for (publication of store.news(); track publication.id) {
        <ion-card (click)="showPublication(publication)">
          <ion-item lines="full">
            <ion-avatar slot="start">
              <skooltrak-picture
                bucket="avatars"
                rounded
                [fileName]="publication.user.avatar_url ?? 'default_avatar.jpg'"
              />
            </ion-avatar>
            <ion-label>
              <h2>
                {{ publication.user.first_name }}
                {{ publication.user.father_name }}
              </h2>
              <p>{{ publication.created_at | date: 'medium' }}</p>
            </ion-label>
          </ion-item>
          <ion-card-header>
            <ion-card-title>
              {{ publication.title }}
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p class="text-preview" [innerText]="publication.body"></p>
          </ion-card-content>
        </ion-card>
      }
      <ion-infinite-scroll (ionInfinite)="infiniteScroll($event)">
        <ion-infinite-scroll-content />
      </ion-infinite-scroll>
      @if (auth.isAdmin()) {
        <ion-fab slot="fixed" horizontal="end" vertical="bottom">
          <ion-fab-button (click)="newPublication()">
            <ion-icon name="add" />
          </ion-fab-button>
        </ion-fab>
      }
    </ion-content>`,
})
export class NewsPage {
  private modalCtrl = inject(ModalController);
  public store = inject(NewsStore);
  public auth = inject(mobileStore.AuthStore);

  constructor() {
    addIcons({ add });
  }

  public ionViewWillEnter(): void {
    setTimeout(() => {
      this.store.getNews();
    }, 1000);
  }

  public async newPublication(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: PublicationFormComponent,
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    !!data && patchState(this.store, { news: [...data, ...this.store.news()] });
  }

  public async showPublication(publication: PublicationObject): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: PublicationsDetailsComponent,
      componentProps: { publication },
    });
    modal.present();
  }

  public infiniteScroll(ev: InfiniteScrollCustomEvent): void {
    this.store.paginate();
    setTimeout(() => {
      ev.target.complete();
    }, 500);
  }
}
