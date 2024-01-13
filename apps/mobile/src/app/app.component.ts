import { Component, effect, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  IonApp,
  IonRouterOutlet,
  NavController,
} from '@ionic/angular/standalone';
import { mobileStore } from '@skooltrak/store';

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
  private readonly navCtrl = inject(NavController);

  constructor() {
    effect(() => {
      !this.auth.loading() && !this.auth.session() && this.signOut();
    });
  }

  public ngOnInit(): void {
    this.messages.fetchChats();
  }

  public async signOut(): Promise<void> {
    this.navCtrl.navigateRoot(['/auth']);
  }
}
