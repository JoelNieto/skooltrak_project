import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';

import { PictureComponent } from '../picture/picture.component';
import { UsersModalStore } from './users-modal.store';

@Component({
  standalone: true,
  providers: [provideComponentStore(UsersModalStore)],
  styles: [
    `
      ion-skeleton-text {
        --border-radius: 9999px;
        --background: var(--ion-color-light);
      }
    `,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Modal</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="modalCtrl.dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar [formControl]="searchControl" />
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        @if (store.LOADING()) {
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
        }
        @for (user of store.USERS(); track user.id) {
          <ion-item>
            <ion-avatar slot="start">
              <skooltrak-picture
                bucket="avatars"
                [pictureURL]="user.avatar_url ?? 'default_avatar.jpg'"
              />
            </ion-avatar>
            <ion-label>
              <h2>{{ user.first_name }} {{ user.father_name }}</h2>
              <p>{{ user.email }}</p>
            </ion-label>
          </ion-item>
        }
      </ion-list>
    </ion-content>
  `,
  imports: [
    IonicModule,
    TranslateModule,
    PictureComponent,
    ReactiveFormsModule,
  ],
})
export class UsersModalComponent implements OnInit {
  public readonly modalCtrl = inject(ModalController);
  public readonly store = inject(UsersModalStore);
  private destroy = inject(DestroyRef);
  public searchControl = new FormControl('', { nonNullable: true });

  public ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroy), debounceTime(500))
      .subscribe({
        next: (QUERY_TEXT) => this.store.patchState({ QUERY_TEXT }),
      });
  }
}
