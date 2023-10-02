import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { authState } from '@skooltrak/auth';
import { ButtonDirective } from '@skooltrak/ui';

import { AvatarComponent } from '../components/avatar/avatar.component';
import { SchoolFormComponent } from '../components/school-form/school-form.component';

@Component({
  standalone: true,
  selector: 'sk-school-info',
  imports: [
    AvatarComponent,
    NgIf,
    TranslateModule,
    DatePipe,
    ButtonDirective,
    DialogModule,
    SchoolFormComponent,
  ],
  styles: [
    `
      .label {
        @apply block font-mono text-sm text-gray-500;
      }
      .value {
        @apply block font-sans text-gray-700;
      }
    `,
  ],
  template: `
    <div class="flex flex-col items-center justify-center space-y-3">
      <sk-avatar
        *ngIf="school()?.crest_url"
        [avatarUrl]="school()?.crest_url!"
        bucket="crests"
        class="h-16"
      />
      <h4 class="font-title text-xl text-gray-700">
        {{ school()?.full_name }}
      </h4>
      <div>
        <button skButton color="green" (click)="editInfo()">Edit</button>
      </div>
      <div
        class="mt-2 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
      >
        <div>
          <div class="label">{{ 'Short name' | translate }}</div>
          <div class="value">{{ school()?.short_name }}</div>
        </div>
        <div>
          <div class="label">{{ 'Country' | translate }}</div>
          <div class="value">{{ school()?.country?.name }}</div>
        </div>
        <div>
          <div class="label">{{ 'Address' | translate }}</div>
          <div class="value">{{ school()?.address }}</div>
        </div>
        <div>
          <div class="label">{{ 'Contact email' | translate }}</div>
          <div class="value">{{ school()?.contact_email }}</div>
        </div>
        <div>
          <div class="label">{{ 'Contact phone' | translate }}</div>
          <div class="value">{{ school()?.contact_phone }}</div>
        </div>
        <div>
          <div class="label">{{ 'Motto' | translate }}</div>
          <div class="value">{{ school()?.motto }}</div>
        </div>
        <div>
          <div class="label">{{ 'Code' | translate }}</div>
          <div class="value">{{ school()?.code }}</div>
        </div>
        <div>
          <div class="label">{{ 'Created at' | translate }}</div>
          <div class="value">
            {{ school()?.created_at | date : 'mediumDate' }}
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SchoolInfoComponent {
  private auth = inject(authState.AuthStateFacade);
  public school = this.auth.currentSchool;
  private dialog = inject(Dialog);

  editInfo() {
    this.dialog.open(SchoolFormComponent, {
      width: '64rem',
      maxWidth: '90%',
      data: this.school(),
    });
  }
}
