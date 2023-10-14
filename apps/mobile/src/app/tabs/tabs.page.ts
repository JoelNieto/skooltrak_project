import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'skooltrak-tabs',
  standalone: true,
  imports: [IonicModule],
  template: `<ion-tabs>
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="tab1">
        <ion-icon aria-hidden="true" name="home-outline"></ion-icon>
      </ion-tab-button>
      <ion-tab-button tab="tab2">
        <ion-icon aria-hidden="true" name="ellipse"></ion-icon>
      </ion-tab-button>
      <ion-tab-button tab="tab2">
        <ion-icon aria-hidden="true" name="ellipse"></ion-icon>
      </ion-tab-button>
      <ion-tab-button tab="tab2">
        <ion-icon aria-hidden="true" name="ellipse"></ion-icon>
      </ion-tab-button>

      <ion-tab-button tab="tab3">
        <ion-icon aria-hidden="true" name="square"></ion-icon>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs> `,
  styles: [],
})
export class TabsPage {
  constructor() {}
}
