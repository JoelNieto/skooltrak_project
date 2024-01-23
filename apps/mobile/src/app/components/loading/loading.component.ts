import { Component, computed, input } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonNote,
  IonSkeletonText,
  IonThumbnail,
} from '@ionic/angular/standalone';

@Component({
  selector: 'skooltrak-loading',
  standalone: true,
  styles: `
    ion-skeleton-text {
      --border-radius: 9999px;
      --background: var(--ion-color-light);
    }
  `,
  imports: [
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonSkeletonText,
    IonNote,
  ],
  template: `
    @for (item of items(); track item) {
      @switch (type()) {
        @case ('card') {
          <ion-card>
            <img src="/assets/images/card-media.png" style="opacity: .3;" />
            <ion-card-header>
              <ion-card-title>
                <ion-skeleton-text animated="true" style="width: 80%;"
              /></ion-card-title>
              <ion-card-subtitle>
                <ion-skeleton-text animated="true" style="width: 60%;"
              /></ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        }
        @case ('users') {
          <ion-item>
            <ion-thumbnail slot="start">
              <ion-skeleton-text [animated]="true" />
            </ion-thumbnail>
            <ion-label>
              <h3>
                <ion-skeleton-text [animated]="true" style="width: 80%;" />
              </h3>
              <p>
                <ion-skeleton-text [animated]="true" style="width: 60%;" />
              </p>
            </ion-label>
          </ion-item>
        }
        @case ('items') {
          <ion-item>
            <ion-label>
              <h3>
                <ion-skeleton-text [animated]="true" style="width: 80%;" />
              </h3>
              <p>
                <ion-skeleton-text [animated]="true" style="width: 60%;" />
              </p>
            </ion-label>
            <ion-note>
              <ion-skeleton-text [animated]="true" style="width: 20%;" />
            </ion-note>
          </ion-item>
        }
      }
    }
  `,
})
export class LoadingComponent {
  public type = input.required<'card' | 'users' | 'items'>();
  public count = input(5);
  public items = computed(() => Array.from(Array(this.count()).keys()));
}
