import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  imports: [IonicModule],
  template: `<ion-content class="ion-padding">
    <h1>Sign in</h1>
  </ion-content>`,
})
export class SignInPage {}
