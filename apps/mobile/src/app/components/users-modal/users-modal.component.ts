import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';

import { PictureComponent } from '../picture/picture.component';
import { UsersModalStore } from './users-modal.store';

@Component({
  standalone: true,
  providers: [UsersModalStore, ModalController],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonThumbnail,
    IonSkeletonText,
    IonLabel,
    IonAvatar,
    IonText,
    TranslateModule,
    PictureComponent,
    ReactiveFormsModule,
  ],
  styles: [
    `
      ion-skeleton-text {
        --border-radius: 9999px;
        --background: var(--ion-color-light);
      }
    `,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>{{ 'CHAT.NEW_CHAT' | translate }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="modalCtrl.dismiss()">{{
            'CHAT.CANCEL' | translate
          }}</ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          inputmode="search"
          [formControl]="searchControl"
          [placeholder]="'CHAT.SEARCH' | translate"
        />
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        @if (store.loading()) {
          <ion-item>
            <ion-thumbnail slot="start">
              <ion-skeleton-text [animated]="true"></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label>
              <h3>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 80%;"
                ></ion-skeleton-text>
              </h3>
              <p>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 60%;"
                ></ion-skeleton-text>
              </p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-thumbnail slot="start">
              <ion-skeleton-text [animated]="true"></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label>
              <h3>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 80%;"
                ></ion-skeleton-text>
              </h3>
              <p>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 60%;"
                ></ion-skeleton-text>
              </p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-thumbnail slot="start">
              <ion-skeleton-text [animated]="true"></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label>
              <h3>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 80%;"
                ></ion-skeleton-text>
              </h3>
              <p>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 60%;"
                ></ion-skeleton-text>
              </p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-thumbnail slot="start">
              <ion-skeleton-text [animated]="true"></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label>
              <h3>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 80%;"
                ></ion-skeleton-text>
              </h3>
              <p>
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 60%;"
                ></ion-skeleton-text>
              </p>
            </ion-label>
          </ion-item>
        } @else {
          @for (user of store.users(); track user.id) {
            <ion-item (click)="modalCtrl.dismiss([user])">
              <ion-avatar slot="start">
                <skooltrak-picture
                  bucket="avatars"
                  rounded
                  [pictureURL]="user.avatar_url ?? 'default_avatar.jpg'"
                />
              </ion-avatar>
              <ion-label>
                <h2>{{ user.first_name }} {{ user.father_name }}</h2>
                <p>{{ user.email }}</p>
              </ion-label>
            </ion-item>
          } @empty {
            <ion-text class="ion-text-center"
              ><h2>{{ 'CHAT.NO_ITEMS' | translate }}</h2>
            </ion-text>
          }
        }
      </ion-list>
    </ion-content>
  `,
})
export class UsersModalComponent implements OnInit {
  public readonly modalCtrl = inject(ModalController);
  public readonly store = inject(UsersModalStore);
  private destroy = inject(DestroyRef);
  public searchControl = new FormControl('', { nonNullable: true });

  public ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (queryText) => patchState(this.store, { queryText }),
      });
  }
}
