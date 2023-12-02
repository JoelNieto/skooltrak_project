import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { messagingState } from '@skooltrak/store';
import { DateAgoPipe } from '@skooltrak/ui';

import { PictureComponent } from '../../components/picture/picture.component';

@Component({
  selector: 'skooltrak-messages',
  standalone: true,
  imports: [
    TranslateModule,
    IonicModule,
    DateAgoPipe,
    RouterLink,
    PictureComponent,
  ],
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
    `,
  ],
  template: `<ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> {{ 'MESSAGING.TITLE' | translate }} </ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon slot="icon-only" name="add-circle"></ion-icon>
          </ion-button>
        </ion-buttons>
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
          <ion-searchbar></ion-searchbar>
        </ion-toolbar>
      </ion-header>
      <ion-list>
        @for (chat of messagesStore.SORTED_CHARTS(); track chat.id) {
          <ion-item
            [routerLink]="'../chat'"
            [queryParams]="{ chat_id: chat.id }"
          >
            @for (member of chat.members; track member.user_id) {
              <ion-avatar aria-hidden="true" slot="start">
                <skooltrak-picture
                  bucket="avatars"
                  [pictureURL]="member.user.avatar_url ?? 'default_avatar.jpg'"
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
        }
      </ion-list>
    </ion-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesPage {
  public messagesStore = inject(messagingState.MessagingStateFacade);

  public ionViewWillEnter() {
    this.messagesStore.getMessages();
  }
}
