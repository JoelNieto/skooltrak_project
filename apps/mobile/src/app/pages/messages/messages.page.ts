import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonRouterOutlet,
  IonSearchbar,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '@skooltrak/models';
import { mobileStore } from '@skooltrak/store';
import { DateAgoPipe } from '@skooltrak/ui';
import { addIcons } from 'ionicons';
import { add, addCircle, trash } from 'ionicons/icons';

import { LoadingComponent } from '../../components/loading/loading.component';
import { PictureComponent } from '../../components/picture/picture.component';
import { UsersModalComponent } from '../../components/users-modal/users-modal.component';

@Component({
    selector: 'skooltrak-messages',
    imports: [
        JsonPipe,
        TranslateModule,
        DateAgoPipe,
        RouterLink,
        PictureComponent,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonSearchbar,
        IonIcon,
        IonList,
        IonItem,
        IonThumbnail,
        IonSkeletonText,
        IonLabel,
        IonItemSliding,
        IonText,
        IonAvatar,
        IonItemOption,
        IonNote,
        IonButtons,
        IonButton,
        IonItemOptions,
        LoadingComponent,
    ],
    providers: [IonRouterOutlet, ModalController],
    styles: [
        `
      ion-avatar {
        --border-radius: 1rem;
      }

      ion-label strong {
        display: block;
        max-width: calc(100% - 60px);
        overflow: hidden;
        text-overflow: ellipsis;
      }
      ion-skeleton-text {
        --border-radius: 9999px;
        --background: var(--ion-color-light);
      }

      .wrap-text {
        overflow: hidden;
        max-height: 1rem;
        display: block;
        text-overflow: ellipsis;
      }
    `,
    ],
    template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-title size="large">
          {{ 'MESSAGING.TITLE' | translate }}
        </ion-title>
        <ion-buttons slot="primary">
          <ion-button slot="icon-only" (click)="searchUser()">
            <ion-icon name="add-circle" size="large" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar color="primary">
        <ion-searchbar inputmode="search"></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true">
      <ion-list>
        @for (chat of store.sortedChats(); track chat.id) {
          <ion-item-sliding>
            <ion-item
              [routerLink]="'chat'"
              [queryParams]="{ chat_id: chat.id }"
            >
              @for (member of chat.members; track member.user_id) {
                <ion-avatar aria-hidden="true" slot="start">
                  <skooltrak-picture
                    bucket="avatars"
                    rounded
                    [fileName]="member.user.avatar_url ?? 'default_avatar.jpg'"
                  />
                </ion-avatar>
                <ion-label
                  ><strong
                    >{{ member.user.first_name }}
                    {{ member.user.father_name }}</strong
                  >
                  <ion-note
                    class="wrap-text"
                    [innerHTML]="chat.message[0].text"
                  >
                  </ion-note>
                </ion-label>

                <ion-note color="medium">
                  {{ chat.last_message | dateAgo }}</ion-note
                >
              }
            </ion-item>
            <ion-item-options>
              <ion-item-option color="danger"
                ><ion-icon slot="icon-only" name="trash"
              /></ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        } @empty {
          @if (store.loading()) {
            <skooltrak-loading type="users" />
          } @else {
            <ion-text class="ion-text-center"
              ><h2>{{ 'CHAT.NO_ITEMS' | translate }}</h2>
            </ion-text>
          }
        }
      </ion-list>
    </ion-content>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesPage {
  public store = inject(mobileStore.MessagesStore);
  private modalCtrl = inject(ModalController);
  private ionRouterOutlet = inject(IonRouterOutlet);

  public loadingItems = new Array(10);
  constructor() {
    addIcons({ trash, add, addCircle });
  }

  public ionViewWillEnter(): void {
    this.store.fetchChats();
  }

  public async searchUser(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: UsersModalComponent,
      presentingElement: this.ionRouterOutlet.nativeEl,
    });
    modal.present();
    const { data } = await modal.onDidDismiss<User[]>();
    data && this.store.newChat(data.map((x) => x.id!));
  }
}
