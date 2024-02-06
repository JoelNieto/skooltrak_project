import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { RoleEnum } from '@skooltrak/models';

import { PublicationFormStore } from './publication-form.store';

@Component({
  standalone: true,
  selector: 'skooltrak-publication-form',
  imports: [
    IonContent,
    IonHeader,
    IonButton,
    IonButtons,
    IonToolbar,
    IonTitle,
    IonInput,
    IonList,
    IonTextarea,
    IonItem,
    TranslateModule,
    IonFooter,
    IonGrid,
    IonCol,
    IonLabel,
    IonSpinner,
    IonRow,
    IonToggle,
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule,
  ],
  providers: [PublicationFormStore],
  styles: `
  `,
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar
        ><ion-title>{{ 'PUBLICATIONS.NEW' | translate }}</ion-title>
        <ion-buttons slot="end">
          <ion-button
            color="primary"
            type="button"
            (click)="modalCtrl.dismiss()"
          >
            {{ 'CONFIRMATION.CANCEL' | translate }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form [formGroup]="form">
        <ion-list>
          <ion-item lines="none">
            <ion-input
              formControlName="title"
              [placeholder]="'PUBLICATIONS.TITLE' | translate"
              counter="true"
              maxlength="60"
            />
          </ion-item>
          <ion-item lines="none">
            <ion-textarea
              formControlName="body"
              [placeholder]="'PUBLICATIONS.BODY' | translate"
              rows="6"
              counter="true"
              maxlength="2000"
            />
          </ion-item>
          <ion-item lines="none">
            <ion-toggle enableOnOffLabels="true" formControlName="is_public">{{
              'PUBLICATIONS.PUBLIC' | translate
            }}</ion-toggle>
          </ion-item>
          <ion-item>
            <ion-select
              [label]="'PUBLICATIONS.ROLES' | translate"
              [formControl]="rolesControl"
              multiple
            >
              @for (role of store.roles(); track role) {
                <ion-select-option [value]="role">
                  {{ role | translate }}
                </ion-select-option>
              }
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-select
              [label]="'PUBLICATIONS.DEGREE' | translate"
              [formControl]="degreesControl"
              multiple
            >
              @for (degree of store.degrees(); track degree.id) {
                <ion-select-option [value]="degree.id">
                  {{ degree.name }}
                </ion-select-option>
              }
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-select
              [label]="'PUBLICATIONS.PLAN' | translate"
              [formControl]="plansControl"
              multiple
            >
              @for (plan of store.plans(); track plan.id) {
                <ion-select-option [value]="plan.id">
                  {{ plan.name }}
                </ion-select-option>
              }
            </ion-select>
          </ion-item>
        </ion-list>
      </form>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-button
                expand="block"
                color="primary"
                shape="round"
                type="submit"
                [disabled]="form.invalid"
                (click)="publish()"
              >
                @if (store.loading()) {
                  <ion-spinner name="crescent" />
                } @else {
                  <ion-label>
                    {{ 'PUBLICATIONS.PUBLISH' | translate }}
                  </ion-label>
                }
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-toolbar>
    </ion-footer>
  `,
})
export class PublicationFormComponent implements OnInit {
  public modalCtrl = inject(ModalController);
  public store = inject(PublicationFormStore);
  public form = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    body: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    is_public: new FormControl(true, { nonNullable: true }),
  });

  public degreesControl = new FormControl<string[]>([], { nonNullable: true });
  public plansControl = new FormControl<string[]>([], { nonNullable: true });
  public rolesControl = new FormControl<RoleEnum[]>(Object.values(RoleEnum), {
    nonNullable: true,
  });

  public ngOnInit(): void {
    this.degreesControl.disable();
    this.plansControl.disable();
    this.rolesControl.disable();
    this.form.get('is_public')?.valueChanges.subscribe({
      next: (value) => {
        if (value) {
          this.degreesControl.disable();
          this.plansControl.disable();
          this.rolesControl.disable();

          return;
        }

        this.degreesControl.enable();
        this.plansControl.enable();
        this.rolesControl.enable();

        if (this.store.degrees().length || this.store.plans().length) {
          return;
        }
        this.store.fetchDegrees();
        this.store.fetchPlans();
      },
    });

    this.degreesControl.valueChanges.subscribe({
      next: (value) => patchState(this.store, { selectedDegrees: value }),
    });
    this.plansControl.valueChanges.subscribe({
      next: (value) => patchState(this.store, { selectedPlans: value }),
    });

    this.rolesControl.valueChanges.subscribe({
      next: (value) => patchState(this.store, { selectedRoles: value }),
    });
  }

  public publish(): void {
    this.store.publish(this.form.value);
  }
}
