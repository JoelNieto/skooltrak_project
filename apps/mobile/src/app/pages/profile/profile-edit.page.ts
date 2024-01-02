import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { mobileStore } from '@skooltrak/store';

import { ProfileEditStore } from './profile-edit.store';

@Component({
  standalone: true,
  selector: 'skooltrak-profile-edit',
  providers: [ProfileEditStore],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    TranslateModule,
    IonButton,
    IonButtons,
    IonList,
    IonItem,
    IonInput,
    IonLabel,
    IonNote,
    ReactiveFormsModule,
    IonDatetime,
    IonPopover,
    IonSelect,
    IonSelectOption,
  ],
  template: `
    <ion-header translucent="true">
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button (click)="modalCtrl.dismiss()">
            {{ 'CHAT.CANCEL' | translate }}
          </ion-button>
        </ion-buttons>
        <ion-title>{{ 'PROFILE.TITLE' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true" color="light">
      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large">{{ 'PROFILE.TITLE' | translate }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <form [formGroup]="form" (ngSubmit)="saveChanges()">
        <ion-list inset="true">
          <ion-item>
            <ion-input
              type="text"
              formControlName="first_name"
              [label]="'PROFILE.FIRST_NAME' | translate"
              labelPlacement="floating"
            />
          </ion-item>
          <ion-item>
            <ion-input
              type="text"
              formControlName="middle_name"
              [label]="'PROFILE.MIDDLE_NAME' | translate"
              labelPlacement="floating"
            />
          </ion-item>
          <ion-item>
            <ion-input
              type="text"
              formControlName="father_name"
              [label]="'PROFILE.FATHER_NAME' | translate"
              labelPlacement="floating"
            />
          </ion-item>
          <ion-item>
            <ion-input
              type="text"
              formControlName="mother_name"
              [label]="'PROFILE.MOTHER_NAME' | translate"
              labelPlacement="floating"
            />
          </ion-item>
        </ion-list>
        <ion-list inset="true">
          <ion-item id="date-input">
            <ion-label>{{ 'PROFILE.BIRTH_DATE' | translate }}</ion-label>
            <ion-note>{{ form.get('birth_date')?.value }}</ion-note>
          </ion-item>
          <ion-popover trigger="date-input" triggerAction="click" size="cover">
            <ng-template>
              <ion-content>
                <ion-datetime
                  id="datetime"
                  presentation="date"
                  locale="es-PA"
                  formControlName="birth_date"
                />
              </ion-content>
            </ng-template>
          </ion-popover>
          <ion-item>
            <ion-input
              labelPlacement="floating"
              placeholder="XX-XXX-XXXXX"
              [label]="'PROFILE.DOCUMENT_ID' | translate"
              formControlName="document_id"
            />
          </ion-item>
          <ion-item>
            <ion-select
              labelPlacement="floating"
              [label]="'PROFILE.GENDER' | translate"
              formControlName="gender"
            >
              @for (gender of store.genders(); track gender) {
                <ion-select-option [value]="gender.id">{{
                  gender.name | translate
                }}</ion-select-option>
              }
            </ion-select>
          </ion-item>
        </ion-list>
        <ion-button
          type="submit"
          [disabled]="this.form.invalid || this.form.pristine"
          expand="block"
          color="primary"
          class="ion-margin"
          >{{ 'SAVE_CHANGES' | translate }}</ion-button
        >
      </form>
    </ion-content>
  `,
})
export class ProfileEditPage implements OnInit {
  public readonly modalCtrl = inject(ModalController);
  public auth = inject(mobileStore.AuthStore);
  public store = inject(ProfileEditStore);
  public form = new FormGroup({
    id: new FormControl<string | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    first_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    middle_name: new FormControl<string>('', {
      nonNullable: true,
    }),
    father_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    mother_name: new FormControl<string>('', {
      nonNullable: true,
    }),
    document_id: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    birth_date: new FormControl<Date | undefined>(undefined, {
      nonNullable: true,
    }),
    gender: new FormControl<number | undefined>(undefined, {
      nonNullable: true,
    }),
  });

  public ngOnInit(): void {
    !!this.auth.user() && this.form.patchValue(this.auth.user()!);
  }

  public saveChanges(): void {
    this.auth.updateProfile(this.form.getRawValue());
  }
}
