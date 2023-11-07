import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroLink, heroPlus, heroXMark } from '@ng-icons/heroicons/outline';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { authState } from '@skooltrak/auth';
import { ButtonDirective, CardComponent, ConfirmationService, defaultConfirmationOptions } from '@skooltrak/ui';

import { AvatarComponent } from '../avatar/avatar.component';
import { SchoolConnectorComponent } from '../school-connector/school-connector.component';
import { SchoolFormComponent } from '../school-form/school-form.component';

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
    ButtonDirective,
    DialogModule,
  ],
  providers: [
    provideIcons({ heroXMark, heroLink, heroPlus }),
    ConfirmationService,
  ],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'SCHOOL_CONNECTOR.TITLE' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <ng-icon
          name="heroXMark"
          size="24"
          class="text-gray-700 dark:text-gray-100"
        />
      </button>
    </div>
    <div>
      <div class="flex flex-col gap-2">
        <div
          *ngFor="let school of schools()"
          (click)="setSchool(school.id!)"
          class="flex cursor-pointer rounded-xl border border-gray-200 px-6 py-3"
          [ngClass]="{
            'border-2 border-sky-700 dark:border-0 dark:bg-gray-600':
              school.id === selected()
          }"
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
              src="assets/images/skooltrak-logo.svg"
              class="h-16"
              alt="Skooltrak Logo"
            />
          </div>
          <div class="gap flex flex-1 flex-col justify-center">
            <p
              class="font-title text-gray-700 dark:text-gray-200"
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
    </div>
    <div class="flex justify-end gap-4 pt-4" footer>
      <button skButton color="green" (click)="addSchoolConnection()">
        <ng-icon name="heroLink" size="16" />
        {{ 'SCHOOL_CONNECTOR.CONNECT' | translate }}
      </button>
      <button skButton color="blue" (click)="createSchool()">
        <ng-icon name="heroPlus" size="16" />
        {{ 'SCHOOL_CONNECTOR.CREATE' | translate }}
      </button>
    </div>
  </sk-card>`,
})
export class SchoolSelectorComponent {
  private auth = inject(authState.AuthStateFacade);
  public dialogRef = inject(DialogRef);
  private dialog = inject(Dialog);
  private confirm = inject(ConfirmationService);
  private destroyRef = inject(DestroyRef);
  private translate = inject(TranslateService);

  public schools = this.auth.SCHOOLS;
  public selected = this.auth.CURRENT_SCHOOL_ID;

  public setSchool(id: string): void {
    this.auth.setSchoolId(id);
    this.dialogRef.close();
  }

  public addSchoolConnection(): void {
    this.dialogRef.close();
    this.dialog.open(SchoolConnectorComponent, {
      width: '36rem',
      maxWidth: '90%',
    });
  }

  public createSchool(): void {
    this.confirm
      .openDialog({
        ...defaultConfirmationOptions,
        showCancelButton: true,
        title: this.translate.instant('SCHOOL_CONNECTOR.CREATE_TITLE'),
        description: this.translate.instant('SCHOOL_CONNECTOR.CREATE_MESSAGE'),
        confirmButtonText: this.translate.instant('YES'),
        color: 'green',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          !!response &&
            this.dialog.open(SchoolFormComponent, {
              width: '64rem',
              maxWidth: '90%',
              disableClose: true,
            });
        },
      });
  }
}
