import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'skooltrak-root',
  standalone: true,
  imports: [IonicModule],
  template: `<ion-app>
    <ion-router-outlet></ion-router-outlet>
  </ion-app>`,
  styles: [],
})
export class AppComponent {
  constructor() {}
}