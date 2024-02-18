import { Component, effect, inject, OnInit, viewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  LoadingController,
} from '@ionic/angular/standalone';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { searchOutline, send } from 'ionicons/icons';

import { PictureComponent } from '../../components/picture/picture.component';
import { ChatStore } from './chat.store';

@Component({
  standalone: true,
  providers: [ChatStore, LoadingController],
  imports: [
    PictureComponent,
    ReactiveFormsModule,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonChip,
    IonBackButton,
    IonButtons,
    IonTitle,
    IonAvatar,
    IonButton,
    IonIcon,
    IonContent,
    IonLabel,
    IonList,
    IonFooter,
    IonItem,
    IonInput,
  ],
  styles: `
     ::ng-deep p {
      margin: 0;
    }
      ion-input {
      --border-radius: 2.5rem;
      --padding-start: 1rem;
    }
    .sender {
      padding-bottom: var(--ion-safe-area-bottom, 0);
    }

    .message {
      background: var(--ion-color-light);
      color: var(--ion-color-light-contrast);
      border-radius: 1rem;
      &.mine {
        background: var(--ion-color-primary);
        color: var(--ion-color-primary-contrast);
      }
    }

    .container {
      position: absolute;
      bottom: 0;
    }

   ion-list {
      display: flex;
      flex-direction: column-reverse;
      margin-top: auto;
      margin-bottom: 0;
    }
  `,
  template: `<ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            [text]="'MESSAGING.TITLE' | translate"
            defaultHref="/tabs/messages"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>
          @for (member of store.currentChat()?.members; track member.user_id) {
            <ion-chip color="primary">
              <ion-avatar aria-hidden="true">
                <skooltrak-picture
                  bucket="avatars"
                  rounded
                  [fileName]="member.user.avatar_url ?? 'default_avatar.jpg'"
                />
              </ion-avatar>
              <ion-label
                >{{ member.user.first_name }}
                {{ member.user.father_name }}</ion-label
              >
            </ion-chip>
          }
        </ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon
              slot="icon-only"
              name="search-outline"
              size="large"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding flex">
      <ion-list>
        @for (chat of store.messages(); track chat) {
          <ion-item lines="none">
            <div
              [slot]="chat.mine ? 'end' : 'start'"
              [innerHTML]="chat.text"
              class="message ion-margin-bottom ion-padding"
              [class.mine]="chat.mine"
            ></div>
          </ion-item>
        }
      </ion-list>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar class="sender"
        ><form [formGroup]="sendForm" (ngSubmit)="sendText()">
          <ion-toolbar>
            <ion-buttons slot="end">
              <ion-button type="submit" [disabled]="sendForm.invalid">
                <ion-icon slot="icon-only" name="send"></ion-icon>
              </ion-button>
            </ion-buttons>
            <ion-input
              formControlName="textBox"
              type="text"
              placeholder="Enter message..."
            />
          </ion-toolbar></form
      ></ion-toolbar>
    </ion-footer>`,
})
export class ChatPage implements OnInit {
  private route = inject(ActivatedRoute);
  public store = inject(ChatStore);
  private loadingCtrl = inject(LoadingController);
  private loading?: HTMLIonLoadingElement;
  public sendForm = new FormGroup({
    textBox: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  private ionContent = viewChild.required(IonContent);

  constructor() {
    effect(() => {
      !this.store.loading() &&
        setTimeout(() => {
          this.loading?.dismiss();
        }, 500);
    });
    addIcons({ send, searchOutline });
  }

  public ionViewWillEnter(): void {
    const tabBar = document.getElementById('app-tab-bar');
    if (tabBar !== null) {
      tabBar.style.display = 'none';
    }
  }

  public ionViewWillLeave(): void {
    const tabBar = document.getElementById('app-tab-bar');
    if (tabBar !== null) {
      tabBar.style.display = 'flex';
    }
  }

  public ngOnInit(): void {
    this.showLoading();
    this.route.queryParams.subscribe({
      next: ({ chat_id }) => {
        patchState(this.store, { chatId: chat_id });
      },
    });
    setTimeout(() => {
      this.ionContent().scrollToBottom(300);
    }, 400);
  }

  private async showLoading(): Promise<void> {
    this.loading = await this.loadingCtrl.create({
      message: 'Loading messages...',
      spinner: 'bubbles',
    });
    this.loading.present();
  }

  public sendText(): void {
    const text = this.sendForm.get('textBox')?.getRawValue();
    this.store.sendMessage(text);
    this.sendForm.reset();
  }
}
