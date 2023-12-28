import { NgOptimizedImage } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    TranslateModule,
    NgOptimizedImage,
    ReactiveFormsModule,
  ],
  styles: `

  `,
  template: `<ion-header class="ion-no-border" [translucent]="true">
      <ion-toolbar>
        <ion-title>{{ 'SIGN_IN.TITLE' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ 'SIGN_IN.TITLE' | translate }}</ion-title>
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
      </form>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-button
          fill="solid"
          expand="block"
          [disabled]="form.invalid"
          (click)="signIn()"
        >
          @if (auth.loading()) {
            <ion-spinner name="crescent" />
          } @else {
            <ion-label>{{ 'SIGN_IN.ENTER' | translate }}</ion-label>
          }
        </ion-button>
      </ion-toolbar>
    </ion-footer> `,
})
export class SignInPage {
  private readonly modalCtrl = inject(ModalController);
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

  constructor() {
    effect(() => {
      if (this.auth.user()) {
        this.modalCtrl.dismiss();
      }
    });
  }

  public signIn(): void {
    const { email, password } = this.form.getRawValue();
    this.auth.signIn({ email, password });
  }
}
