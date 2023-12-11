import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'skooltrak-home',
  imports: [IonicModule, RouterLink],
  template: `<ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title> Inicio </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true"> </ion-content> `,
})
export class HomePage {}
