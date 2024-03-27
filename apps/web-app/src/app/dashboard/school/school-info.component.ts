import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { webStore } from '@skooltrak/store';

import { AvatarComponent } from '../../components/avatar/avatar.component';
import { SchoolFormComponent } from '../../components/school-form/school-form.component';

@Component({
  standalone: true,
  selector: 'sk-school-info',
  imports: [
    AvatarComponent,
    TranslateModule,
    DatePipe,
    MatButton,
    DialogModule,
    SchoolFormComponent,
  ],
  styles: `
      .label {
        @apply block font-mono text-sm text-gray-500 dark:text-gray-400;
      }
      .value {
        @apply block font-sans text-gray-700 dark:text-gray-200;
      }
    `,
  template: `
    <div class="flex flex-col items-center justify-center space-y-3">
      @if (school()?.crest_url) {
        <sk-avatar
          [fileName]="school()?.crest_url!"
          bucket="crests"
          class="h-16"
        />
      }

      <h4 class="mat-headline-5">
        {{ school()?.full_name }}
      </h4>
      <div>
        <button mat-flat-button color="accent" (click)="editInfo()">
          {{ 'EDIT' | translate }}
        </button>
      </div>
      <div
        class="mt-2 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
      >
        <div>
          <div class="label">{{ 'SCHOOL.SHORT_NAME' | translate }}</div>
          <div class="value">{{ school()?.short_name }}</div>
        </div>
        <div>
          <div class="label">{{ 'SCHOOL.COUNTRY' | translate }}</div>
          <div class="value">{{ school()?.country?.name }}</div>
        </div>
        <div>
          <div class="label">{{ 'SCHOOL.TYPE' | translate }}</div>
          <div class="value">
            {{ 'SCHOOL_TYPE.' + school()?.type! | translate }}
          </div>
        </div>
        <div>
          <div class="label">{{ 'SCHOOL.ADDRESS' | translate }}</div>
          <div class="value">{{ school()?.address }}</div>
        </div>
        <div>
          <div class="label">{{ 'SCHOOL.EMAIL' | translate }}</div>
          <div class="value">{{ school()?.contact_email }}</div>
        </div>
        <div>
          <div class="label">{{ 'SCHOOL.PHONE' | translate }}</div>
          <div class="value">{{ school()?.contact_phone }}</div>
        </div>
        <div>
          <div class="label">{{ 'CODE' | translate }}</div>
          <div class="value">{{ school()?.code }}</div>
        </div>
        <div>
          <div class="label">{{ 'CREATED_AT' | translate }}</div>
          <div class="value">
            {{ school()?.created_at | date: 'mediumDate' }}
          </div>
        </div>
        <div class="cols-2">
          <div class="label">{{ 'SCHOOL.MOTTO' | translate }}</div>
          <div class="value">{{ school()?.motto }}</div>
        </div>
      </div>
    </div>
  `,
})
export class SchoolInfoComponent {
  private auth = inject(webStore.AuthStore);
  public school = this.auth.currentSchool;
  private dialog = inject(Dialog);

  public editInfo(): void {
    this.dialog.open(SchoolFormComponent, {
      width: '64rem',
      maxWidth: '90%',
      data: this.school(),
    });
  }
}
