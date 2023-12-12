import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'skooltrak-tabs',
  standalone: true,
  imports: [IonicModule],
  styles: [],
  template: `<ion-tabs class="ion-no-border">
    <ion-tab-bar id="app-tab-bar" slot="bottom ion-no-border">
      <ion-tab-button tab="home">
        <ion-icon aria-hidden="true" name="home-outline" />
        Home
      </ion-tab-button>

      <ion-tab-button tab="schedule">
        <ion-icon aria-hidden="true" name="calendar-outline" />
        Settings
      </ion-tab-button>
      <ion-tab-button tab="notifications">
        <ion-icon aria-hidden="true" name="notifications-outline" />
        Settings
      </ion-tab-button>
      <ion-tab-button tab="messages">
        <ion-icon aria-hidden="true" name="chatbubbles-outline" />
        Messages
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs> `,
})
export class TabsPage {}
