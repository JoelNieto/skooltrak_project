import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'skooltrak-home',
  imports: [IonicModule, RouterLink],
  template: `<ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button (click)="goToMessages()">
            <ion-icon slot="icon-only" name="chatbubbles-outline" size="large"
          /></ion-button>
        </ion-buttons>
        <ion-title> Inicio </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true"> </ion-content> `,
})
export class HomePage {
  private readonly nav = inject(NavController);

  public goToMessages(): void {
    this.nav.navigateForward('/messages');
  }
}
