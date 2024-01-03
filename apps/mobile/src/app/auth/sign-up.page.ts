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
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { mobileStore } from '@skooltrak/store';

@Component({
  standalone: true,
  selector: 'skooltrak-sign-up',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonInput,
    IonItem,
    IonText,
    IonButton,
    RouterLink,
    TranslateModule,
    ReactiveFormsModule,
  ],
  template: `<ion-header translucent="true">
      <ion-toolbar>
        <ion-title>{{ 'SIGN_UP.TITLE' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large" color="primary">{{
            'SIGN_UP.TITLE' | translate
          }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-text color="medium">
        <h3 class="ion-margin">{{ 'SIGN_UP.PROVIDE_INFO' | translate }}</h3>
      </ion-text>
      <form [formGroup]="form" (ngSubmit)="signUp()">
        <ion-list>
          <ion-item>
            <ion-input
              type="text"
              formControlName="first_name"
              placeholder="John"
              [label]="'SIGN_UP.FIRST_NAME' | translate"
              labelPlacement="floating"
            />
          </ion-item>
          <ion-item>
            <ion-input
              type="text"
              formControlName="father_name"
              placeholder="Doe"
              [label]="'SIGN_UP.FATHER_NAME' | translate"
              labelPlacement="floating"
            />
          </ion-item>
          <ion-item>
            <ion-input
              type="email"
              formControlName="email"
              placeholder="user@domain.com"
              email
              [label]="'SIGN_UP.EMAIL' | translate"
              labelPlacement="floating"
            />
          </ion-item>
          <ion-item>
            <ion-input
              type="password"
              formControlName="password"
              placeholder="********"
              [label]="'SIGN_UP.PASSWORD' | translate"
              labelPlacement="floating"
            />
          </ion-item>
          <ion-item>
            <ion-input
              type="password"
              formControlName="confirm_password"
              placeholder="********"
              [label]="'SIGN_UP.CONFIRM_PASSWORD' | translate"
              labelPlacement="floating"
            />
          </ion-item>
        </ion-list>
        <ion-button
          type="submit"
          color="primary"
          expand="block"
          shape="round"
          class="ion-margin"
          >{{ 'SIGN_UP.CREATE_ACCOUNT' | translate }}</ion-button
        >
      </form>
      <ion-button
        color="primary"
        fill="clear"
        routerLink="../sign-in"
        routerAnimation="back"
        >{{ 'SIGN_UP.SIGN_IN' | translate }}</ion-button
      >
    </ion-content>`,
})
export class SignUpPage {
  private readonly auth = inject(mobileStore.AuthStore);
  public form = new FormGroup({
    first_name: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    father_name: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    confirm_password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });
  public signUp(): void {
    const { first_name, father_name, email, password } =
      this.form.getRawValue();
    this.auth.signUp({ father_name, first_name, email, password });
  }
}
