import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { mobileStore } from '@skooltrak/store';

@Component({
  standalone: true,
  selector: 'skooltrak-sign-in',
  providers: [ModalController],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonLabel,
    IonItem,
    IonInput,
    IonFooter,
    IonToolbar,
    IonButton,
    IonSpinner,
    IonText,
    TranslateModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    RouterLink,
  ],
  styles: `

  `,
  template: `<ion-header class="ion-no-border" [translucent]="true">
      <ion-toolbar>
        <ion-title color="primary">{{ 'SIGN_IN.TITLE' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large" color="primary">{{
            'SIGN_IN.TITLE' | translate
          }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <form [formGroup]="form">
        <ion-list lines="inset">
          <ion-item>
            <ion-input
              type="email"
              labelPlacement="floating"
              [label]="'SIGN_IN.EMAIL' | translate"
              placeholder="name@company.com"
              formControlName="email"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-input
              type="password"
              labelPlacement="floating"
              [label]="'SIGN_IN.PASSWORD' | translate"
              placeholder="********"
              formControlName="password"
            ></ion-input>
          </ion-item>
        </ion-list>
        <ion-button
          class="ion-margin"
          fill="solid"
          expand="block"
          [disabled]="form.invalid"
          (click)="signIn()"
          shape="round"
        >
          @if (auth.loading()) {
            <ion-spinner name="crescent" />
          } @else {
            <ion-label>{{ 'SIGN_IN.ENTER' | translate }}</ion-label>
          }
        </ion-button>
      </form>
      <ion-button fill="clear" routerLink="../sign-up">
        {{ 'SIGN_IN.SIGN_UP' | translate }}
      </ion-button>
      <ion-button fill="clear" color="danger" routerLink="../reset-password">
        {{ 'SIGN_IN.FORGOT_PASSWORD' | translate }}
      </ion-button>
    </ion-content>`,
})
export class SignInPage {
  public readonly auth = inject(mobileStore.AuthStore);
  public form = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
  });

  public signIn(): void {
    const { email, password } = this.form.getRawValue();
    this.auth.signIn({ email, password });
  }
}
