import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { mobileStore } from '@skooltrak/store';

@Component({
    imports: [
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonInput,
        IonText,
        IonItem,
        IonButton,
        RouterLink,
        ReactiveFormsModule,
        TranslateModule,
    ],
    selector: 'skooltrak-reset-password',
    template: `<ion-header translucent="true">
      <ion-toolbar>
        <ion-title color="primary" size="large">{{
          'RESET_PASSWORD.TITLE' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large" color="primary">{{
            'RESET_PASSWORD.TITLE' | translate
          }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-text color="medium">
        <h3 class="ion-margin">{{ 'RESET_PASSWORD.SUBTITLE' | translate }}</h3>
      </ion-text>
      <ion-item>
        <ion-input
          [formControl]="emailControl"
          email
          type="email"
          placeholder="user@domain"
          [label]="'SIGN_UP.EMAIL' | translate"
          labelPlacement="floating"
        />
      </ion-item>
      <ion-button
        color="primary"
        shape="round"
        expand="block"
        [disabled]="emailControl.invalid"
        class="ion-margin"
        (click)="sendRequest()"
      >
        {{ 'RESET_PASSWORD.SEND_REQUEST' | translate }}
      </ion-button>
      <ion-button color="primary" fill="clear" routerLink="../sign-in">{{
        'SIGN_UP.SIGN_IN' | translate
      }}</ion-button>
    </ion-content> `
})
export class ResetPasswordPage {
  private auth = inject(mobileStore.AuthStore);
  public emailControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  public sendRequest(): void {
    const email = this.emailControl.getRawValue();
    this.auth.resetPassword(email);
  }
}
