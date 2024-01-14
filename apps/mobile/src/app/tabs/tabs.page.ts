import { Component } from '@angular/core';
import {
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  chatbubblesOutline,
  homeOutline,
  personOutline,
} from 'ionicons/icons';

@Component({
  selector: 'skooltrak-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, TranslateModule],
  styles: [
    `
      ion-tab-bar {
        --border: 0;
      }
    `,
  ],
  template: `<ion-tabs>
    <ion-tab-bar id="app-tab-bar" slot="bottom">
      <ion-tab-button tab="home">
        <ion-icon aria-hidden="true" name="home-outline" />
      </ion-tab-button>

      <ion-tab-button tab="schedule">
        <ion-icon aria-hidden="true" name="calendar-outline" />
      </ion-tab-button>
      <ion-tab-button tab="messages">
        <ion-icon aria-hidden="true" name="chatbubbles-outline" />
      </ion-tab-button>
      <ion-tab-button tab="profile">
        <ion-icon aria-hidden="true" name="person-outline" />
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs> `,
})
export class TabsPage {
  constructor() {
    addIcons({
      homeOutline,
      calendarOutline,
      chatbubblesOutline,
      personOutline,
    });
  }
}
