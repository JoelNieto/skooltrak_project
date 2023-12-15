import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonAvatar,
  IonContent,
  IonFab,
  IonFabButton,
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
import { DateAgoPipe } from '@skooltrak/ui';
import { addIcons } from 'ionicons';
import { add, trash } from 'ionicons/icons';

import { PictureComponent } from '../../components/picture/picture.component';
import { UsersModalComponent } from '../../components/users-modal/users-modal.component';
import { messagesStore } from './messages.store';

@Component({
  selector: 'skooltrak-messages',
  standalone: true,
  imports: [
    TranslateModule,
    DateAgoPipe,
    RouterLink,
    PictureComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonFab,
    IonFabButton,
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
    IonItemOptions,
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
    `,
  ],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> {{ 'MESSAGING.TITLE' | translate }} </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            {{ 'MESSAGING.TITLE' | translate }}</ion-title
          >
        </ion-toolbar>
        <ion-toolbar>
          <ion-searchbar inputmode="search"></ion-searchbar>
        </ion-toolbar>
      </ion-header>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button (click)="searchUser()">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <ion-list>
        @if (store.loading()) {
          <ion-item>
            <ion-thumbnail slot="start">
              <ion-skeleton-text [animated]="true"></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label>
              <h3>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 80%;"
                ></ion-skeleton-text>
              </h3>
              <p>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 60%;"
                ></ion-skeleton-text>
              </p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-thumbnail slot="start">
              <ion-skeleton-text [animated]="true"></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label>
              <h3>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 80%;"
                ></ion-skeleton-text>
              </h3>
              <p>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 60%;"
                ></ion-skeleton-text>
              </p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-thumbnail slot="start">
              <ion-skeleton-text [animated]="true"></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label>
              <h3>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 80%;"
                ></ion-skeleton-text>
              </h3>
              <p>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 60%;"
                ></ion-skeleton-text>
              </p>
            </ion-label>
          </ion-item>
        } @else {
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
                      [pictureURL]="
                        member.user.avatar_url ?? 'default_avatar.jpg'
                      "
                    />
                  </ion-avatar>
                  <ion-label
                    ><strong
                      >{{ member.user.first_name }}
                      {{ member.user.father_name }}</strong
                    >
                    <ion-text>{{ member.user.email }}</ion-text
                    ><ion-note color="medium">
                      {{ chat.last_message | dateAgo }}</ion-note
                    ></ion-label
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
            <ion-text class="ion-text-center"
              ><h2>{{ 'CHAT.NO_ITEMS' | translate }}</h2>
            </ion-text>
          }
        }
      </ion-list>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesPage {
  public store = inject(messagesStore);
  private modalCtrl = inject(ModalController);
  private ionRouterOutlet = inject(IonRouterOutlet);
  constructor() {
    addIcons({ trash, add });
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
