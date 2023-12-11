import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [IonicModule, TranslateModule],
  template: `<ion-header>
      <ion-toolbar>
        <ion-title size="large"> {{ 'SCHEDULE' | translate }}</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar></ion-searchbar>
      </ion-toolbar> </ion-header
    ><ion-content>
      <ion-datetime></ion-datetime>
    </ion-content>`,
})
export class SchedulePage {}
