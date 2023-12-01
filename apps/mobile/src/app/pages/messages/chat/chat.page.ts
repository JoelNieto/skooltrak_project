import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonicModule, LoadingController } from '@ionic/angular';
import { provideComponentStore } from '@ngrx/component-store';
import { mobileMessagingState } from '@skooltrak/store';

import { PictureComponent } from '../../../components/picture/picture.component';
import { ChatStore } from './chat.store';

@Component({
  standalone: true,
  providers: [provideComponentStore(ChatStore)],
  styles: `
     ::ng-deep p {
      margin: 0;
    }
      ion-input {
      --border-radius: 2.5rem;
      --padding-start: 1rem;
    }
    .footer {
      padding: .25rem;
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
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>
          @for (member of state.SELECTED()?.members; track member.user_id) {
            <ion-avatar aria-hidden="true" slot="start">
              <skooltrak-picture
                bucket="avatars"
                [pictureURL]="member.user.avatar_url ?? 'default_avatar.jpg'"
              />
            </ion-avatar>
            {{ member.user.first_name }}
            {{ member.user.father_name }}
          }
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding flex">
      <ion-list>
        @for (chat of store.MESSAGES(); track chat) {
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
      <form [formGroup]="sendForm" (ngSubmit)="sendText()">
        <ion-toolbar class="footer">
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
        </ion-toolbar>
      </form>
    </ion-footer>`,
  imports: [IonicModule, PictureComponent, ReactiveFormsModule],
})
export class ChatPage implements OnInit {
  private route = inject(ActivatedRoute);
  public store = inject(ChatStore);
  public state = inject(mobileMessagingState.MessagingStateFacade);
  private loadingCtrl = inject(LoadingController);
  private loading?: HTMLIonLoadingElement;
  public sendForm = new FormGroup({
    textBox: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  @ViewChild(IonContent, { static: true }) private ionContent!: IonContent;

  constructor() {
    effect(() => {
      !this.store.LOADING() &&
        setTimeout(() => {
          this.loading?.dismiss();
        }, 1000);
    });
  }

  public ngOnInit(): void {
    this.showLoading();
    this.route.queryParams.subscribe({
      next: ({ chat_id }) => {
        this.state.setCurrentChat(chat_id);
      },
    });
    setTimeout(() => {
      this.ionContent.scrollToBottom(300);
    }, 2000);
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
