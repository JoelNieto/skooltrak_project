import { DatePipe, DecimalPipe, KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonChip,
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';

import { LoadingComponent } from '../../components/loading/loading.component';
import { CourseGradesStore } from './course-grades.store';

@Component({
  standalone: true,
  imports: [
    IonTitle,
    IonHeader,
    IonToolbar,
    IonContent,
    TranslateModule,
    IonChip,
    IonSelect,
    IonList,
    IonItem,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonNote,
    IonSelectOption,
    DecimalPipe,
    KeyValuePipe,
    DatePipe,
    LoadingComponent,
  ],
  providers: [CourseGradesStore],
  styles: `
  ion-toolbar {
    --ion-safe-area-top: 0;
  }
`,
  selector: 'skooltrak-course-grades',
  template: `<ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-select
          class="ion-padding-horizontal"
          [label]="'GRADES.PERIOD' | translate"
          [placeholder]="'GRADES.SELECT_PERIOD' | translate"
          interface="action-sheet"
          (ionChange)="changePeriod($event.target.value)"
        >
          @for (period of store.periods(); track period.id) {
            <ion-select-option [value]="period.id">{{
              period.name
            }}</ion-select-option>
          }
        </ion-select>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-vertical">
      <ion-list>
        @for (bucket of store.groupedGrades() | keyvalue; track bucket) {
          <ion-item-group>
            <ion-item-divider color="secondary">
              <ion-label>
                {{ bucket.key }}
              </ion-label>
            </ion-item-divider>
            @for (grade of bucket.value; track grade.id; let last = $last) {
              <ion-item [lines]="last ? 'none' : undefined">
                <ion-label>
                  <h2>{{ grade.grade?.title }}</h2>
                  <ion-note>
                    {{ grade.created_at | date: 'medium' }}
                  </ion-note>
                </ion-label>
                <ion-chip [color]="grade?.score! >= 4 ? 'success' : 'warning'">
                  {{ grade.score | number: '1.1' }}
                </ion-chip>
              </ion-item>
            }
          </ion-item-group>
        } @empty {
          @if (store.loading()) {
            <skooltrak-loading type="items" />
          }
        }
      </ion-list>
    </ion-content>`,
})
export class CourseGradesPage {
  public store = inject(CourseGradesStore);

  public changePeriod(id: string): void {
    patchState(this.store, { currentPeriod: id });
  }
}
