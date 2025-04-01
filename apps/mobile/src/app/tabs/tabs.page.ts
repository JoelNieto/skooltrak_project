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
  appsOutline,
  calendarOutline,
  chatbubblesOutline,
  homeOutline,
  newspaperOutline,
  personOutline,
} from 'ionicons/icons';

@Component({
    selector: 'skooltrak-tabs',
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
      <ion-tab-button tab="news">
        <ion-icon aria-hidden="true" name="newspaper-outline" />
        {{ 'NEWS.TITLE' | translate }}
      </ion-tab-button>
      <ion-tab-button tab="courses">
        <ion-icon aria-hidden="true" name="apps-outline" />
        {{ 'COURSES.TITLE' | translate }}
      </ion-tab-button>
      <ion-tab-button tab="schedule">
        <ion-icon aria-hidden="true" name="calendar-outline" />
        {{ 'SCHEDULE' | translate }}
      </ion-tab-button>
      <ion-tab-button tab="messages">
        <ion-icon aria-hidden="true" name="chatbubbles-outline" />
        {{ 'MESSAGING.TITLE' | translate }}
      </ion-tab-button>
      <ion-tab-button tab="profile">
        <ion-icon aria-hidden="true" name="person-outline" />
        {{ 'PROFILE.NAME' | translate }}
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs> `
})
export class TabsPage {
  constructor() {
    addIcons({
      homeOutline,
      calendarOutline,
      chatbubblesOutline,
      personOutline,
      newspaperOutline,
      appsOutline,
    });
  }
}
