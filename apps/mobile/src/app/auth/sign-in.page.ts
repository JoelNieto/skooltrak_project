import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  imports: [IonicModule],
  styles: `
  .background {
	  --background: url('/assets/images/sign-in-bg.jpg');
  }

  #container{
    text-align: center;
    padding: 2rem;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .logo {
    height: 60px;
  }
  `,
  template: `<ion-content class="ion-padding background" fullscreen="true">
    <ion-card>
      <ion-card-header
        ><img src="assets/images/skooltrak.svg" alt="logo" class="logo"
      /></ion-card-header>
      <ion-card-content>
        <form>
          <ion-list>
            <ion-item>
              <ion-label
                >Usuario <ion-text color="danger">*</ion-text></ion-label
              >
              <ion-input required type="email"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label
                >Contraseña <ion-text color="danger">*</ion-text></ion-label
              >
              <ion-input required type="password"></ion-input>
            </ion-item>
          </ion-list>
          <ion-button expand="block" color="primary" type="submit">
            Iniciar sesión
          </ion-button>
        </form>
      </ion-card-content>
      <ion-card-footer></ion-card-footer>
    </ion-card>
  </ion-content>`,
})
export class SignInPage {}
