import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { mobileStore } from '@skooltrak/store';

import { SignInPage } from './auth/sign-in.page';

@Component({
  selector: 'skooltrak-root',
  standalone: true,
  providers: [ModalController],
  imports: [IonApp, IonRouterOutlet],
  template: `<ion-app>
    <ion-router-outlet />
  </ion-app>`,
})
export class AppComponent implements OnInit {
  private readonly auth = inject(mobileStore.AuthStore);
  private readonly messages = inject(mobileStore.MessagesStore);
  private readonly modalCtrl = inject(ModalController);
  private readonly signInOpen = signal(false);

  constructor() {
    effect(() => {
      !this.auth.loading() &&
        !this.auth.user() &&
        !this.signInOpen() &&
        this.openModal();
    });
  }

  public ngOnInit(): void {
    this.messages.fetchChats();
    !this.auth.loading() && !this.auth.user() && this.openModal();
  }

  public async openModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SignInPage,
    });
    modal.present();
    this.signInOpen.set(true);
    await modal.onWillDismiss();
    this.signInOpen.set(false);
  }
}
