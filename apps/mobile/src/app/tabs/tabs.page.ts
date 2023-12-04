import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'skooltrak-tabs',
  standalone: true,
  imports: [IonicModule],
  template: `<ion-tabs>
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="tab1">
        <ion-icon aria-hidden="true" name="home-outline" />
        Home
      </ion-tab-button>
      <ion-tab-button tab="messages">
        <ion-icon aria-hidden="true" name="chatbubbles-outline" />
        Messages
      </ion-tab-button>
      <ion-tab-button tab="tab3">
        <ion-icon aria-hidden="true" name="build-outline" />
        Setting
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs> `,
})
export class TabsPage {
  constructor() {}
}
