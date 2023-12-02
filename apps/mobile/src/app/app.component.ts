import { Component, effect, inject, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { mobileAuthState } from '@skooltrak/store';

import { SignInPage } from './auth/sign-in.page';

@Component({
  selector: 'skooltrak-root',
  standalone: true,
  imports: [IonicModule],
  template: `<ion-app>
    <ion-router-outlet></ion-router-outlet>
  </ion-app>`,
})
export class AppComponent implements OnInit {
  private readonly store = inject(mobileAuthState.MobileAuthFacade);
  private readonly modalCtrl = inject(ModalController);

  constructor() {
    effect(() => {
      !this.store.LOADING() && !this.store.USER() && this.openModal();
    });
  }

  public ngOnInit(): void {
    this.store.init();
  }

  public async openModal() {
    const modal = await this.modalCtrl.create({
      component: SignInPage,
    });
    modal.present();
  }
}
