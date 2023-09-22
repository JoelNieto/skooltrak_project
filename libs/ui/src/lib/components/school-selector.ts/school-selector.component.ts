import { DialogRef } from '@angular/cdk/dialog';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { authState } from '@skooltrak/auth';

import { AvatarComponent } from '../avatar/avatar.component';
import { CardComponent } from '../card/card.component';

@Component({
  standalone: true,
  selector: 'sk-school-selector',
  imports: [
    CardComponent,
    TranslateModule,
    NgIconComponent,
    AvatarComponent,
    NgFor,
    NgIf,
    NgClass,
  ],
  providers: [provideIcons({ heroXMark })],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'Select school' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <ng-icon
          name="heroXMark"
          size="24"
          class="text-gray-700 dark:text-gray-100"
        />
      </button>
    </div>
    <div class="flex flex-col gap-2">
      <div
        *ngFor="let school of schools()"
        (click)="setSchool(school.id!)"
        class="flex cursor-pointer rounded-xl border border-gray-200 px-6 py-3"
        [ngClass]="{ 'border-2 border-sky-700': school.id === selected() }"
      >
        <div class="flex flex-1 items-center justify-center">
          <sk-avatar
            *ngIf="school?.crest_url"
            [avatarUrl]="school.crest_url!"
            bucket="crests"
            class="h-16"
          />
          <img
            *ngIf="!school?.crest_url"
            src="assets/skooltrak-logo.svg"
            class="h-16"
            alt="Skooltrak Logo"
          />
        </div>
        <div class="gap flex flex-1 flex-col justify-center">
          <p
            class="font-title text-gray-700"
            [ngClass]="{ 'font-semibold': school.id === selected() }"
          >
            {{ school.full_name }}
          </p>
          <p class="font-sans text-sm italic text-gray-400">
            {{ school.motto }}
          </p>
        </div>
      </div>
    </div>
  </sk-card>`,
})
export class SchoolSelectorComponent {
  private auth = inject(authState.AuthStateFacade);
  public dialogRef = inject(DialogRef);

  public schools = this.auth.schools;
  public selected = this.auth.currentSchoolId;

  public setSchool(id: string): void {
    this.auth.setSchoolId(id);
    this.dialogRef.close();
  }
}
