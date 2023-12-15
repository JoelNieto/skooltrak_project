import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'skooltrak-home',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
  template: `<ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title> Inicio </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true"> </ion-content> `,
})
export class HomePage {}
