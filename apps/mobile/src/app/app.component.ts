import { Component, effect, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { mobileAuthState } from '@skooltrak/store';

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

  public async openModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SignInPage,
    });
    modal.present();
  }
}
