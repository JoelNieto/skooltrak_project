import { Component, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  standalone: true,
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Modal</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="modalCtrl.dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-avatar slot="start">
            <ion-img src="https://i.pravatar.cc/300?u=b"></ion-img>
          </ion-avatar>
          <ion-label>
            <h2>Connor Smith</h2>
            <p>Sales Rep</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-avatar slot="start">
            <ion-img src="https://i.pravatar.cc/300?u=a"></ion-img>
          </ion-avatar>
          <ion-label>
            <h2>Daniel Smith</h2>
            <p>Product Designer</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-avatar slot="start">
            <ion-img src="https://i.pravatar.cc/300?u=d"></ion-img>
          </ion-avatar>
          <ion-label>
            <h2>Greg Smith</h2>
            <p>Director of Operations</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-avatar slot="start">
            <ion-img src="https://i.pravatar.cc/300?u=e"></ion-img>
          </ion-avatar>
          <ion-label>
            <h2>Zoey Smith</h2>
            <p>CEO</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  imports: [IonicModule],
})
export class UsersModalComponent {
  public readonly modalCtrl = inject(ModalController);
}
