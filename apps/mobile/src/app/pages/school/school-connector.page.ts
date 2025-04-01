import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { RoleEnum } from '@skooltrak/models';

import { SchoolConnectorStore } from './school-connector.store';

@Component({
    imports: [
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        TranslateModule,
        IonInput,
        IonList,
        IonSelect,
        IonSelectOption,
        IonItem,
        IonSpinner,
        IonLabel,
        IonButton,
        IonButtons,
        ReactiveFormsModule,
        IonText,
    ],
    providers: [SchoolConnectorStore],
    template: `<ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title color="primary">
          {{ 'SCHOOL_CONNECTOR.CONNECT' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="modalCtrl.dismiss()">
            {{ 'CHAT.CANCEL' | translate }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title color="primary" size="large">
            {{ 'SCHOOL_CONNECTOR.CONNECT' | translate }}
          </ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-text color="medium">
        <h3 class="ion-margin">{{ 'SCHOOL_CONNECTOR.HELPER' | translate }}</h3>
      </ion-text>
      <form [formGroup]="form" (ngSubmit)="validateCode()">
        <ion-list lines="full" class="ion-padding-start">
          <ion-input
            class="ion-padding-horizontal ion-margin-end"
            formControlName="code"
            [label]="'SCHOOL_CONNECTOR.CODE_LABEL' | translate"
            labelPlacement="floating"
            [placeholder]="'SCHOOL_CONNECTOR.CODE_PLACEHOLDER' | translate"
            inputmode="numeric"
            counter="true"
            maxlength="10"
          />
          <ion-item>
            <ion-select
              formControlName="role"
              [label]="'SCHOOL_CONNECTOR.SELECT_ROLE' | translate"
              labelPlacement="floating"
            >
              @for (role of roles; track role) {
                <ion-select-option [value]="role">{{
                  role | translate
                }}</ion-select-option>
              }
            </ion-select>
          </ion-item>
        </ion-list>
        <ion-button
          expand="block"
          type="submit"
          [disabled]="form.invalid"
          color="primary"
          shape="round"
          class="ion-margin"
        >
          @if (store.loading()) {
            <ion-spinner name="crescent" />
          } @else {
            <ion-label>{{ 'CONFIRM' | translate }}</ion-label>
          }
        </ion-button>
      </form>
    </ion-content>`
})
export class SchoolConnectorPage {
  private numberRegEx = /^\d+$/;

  public store = inject(SchoolConnectorStore);
  public modalCtrl = inject(ModalController);
  public form = new FormGroup({
    code: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(this.numberRegEx),
      ],
    }),
    role: new FormControl<RoleEnum>(RoleEnum.Student, {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  public roles = Object.values(RoleEnum);

  public validateCode(): void {
    const { code, role } = this.form.getRawValue();
    patchState(this.store, { role });
    this.store.fetchSchoolByCode(code);
  }
}
