import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { patchState } from '@ngrx/signals';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { webStore } from '@skooltrak/store';
import { ConfirmationService, defaultConfirmationOptions } from '@skooltrak/ui';

import { AvatarComponent } from '../avatar/avatar.component';
import { SchoolConnectorComponent } from '../school-connector/school-connector.component';
import { SchoolFormComponent } from '../school-form/school-form.component';

@Component({
  standalone: true,
  selector: 'sk-school-selector',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    AvatarComponent,
    NgClass,
    DialogModule,
  ],
  providers: [ConfirmationService],
  template: `<mat-card>
    <mat-card-header header>
      <div class="flex items-start justify-between w-full">
        <mat-card-title>
          {{ 'SCHOOL_CONNECTOR.TITLE' | translate }}
        </mat-card-title>
        <button mat-icon-button (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </mat-card-header>
    <mat-card-content>
      <div class="flex flex-col gap-2">
        @for (school of schools(); track school.id) {
          <div
            (click)="setSchool(school.id!)"
            class="flex cursor-pointer rounded-xl border border-gray-200 px-6 py-3"
            [ngClass]="{
              'border-2 border-sky-700 dark:border-0 dark:bg-gray-600':
                school.id === selected()
            }"
          >
            <div class="flex flex-1 items-center justify-center">
              @if (school?.crest_url) {
                <sk-avatar
                  [fileName]="school.crest_url!"
                  bucket="crests"
                  class="h-16"
                />
              } @else {
                <img
                  src="assets/images/skooltrak-logo.svg"
                  class="h-16"
                  alt="Skooltrak Logo"
                />
              }
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
        }
      </div>
    </mat-card-content>
    <mat-card-footer class="flex justify-end gap-4 pt-4" footer>
      <mat-card-actions align="end" class="gap-2">
        <button mat-stroked-button (click)="addSchoolConnection()">
          <mat-icon>link</mat-icon>
          <span>{{ 'SCHOOL_CONNECTOR.CONNECT' | translate }}</span>
        </button>
        <button mat-flat-button color="blue" (click)="createSchool()">
          <mat-icon>add</mat-icon>
          <span>{{ 'SCHOOL_CONNECTOR.CREATE' | translate }}</span>
        </button>
      </mat-card-actions>
    </mat-card-footer>
  </mat-card>`,
})
export class SchoolSelectorComponent {
  private auth = inject(webStore.AuthStore);
  public dialogRef = inject(DialogRef);
  private dialog = inject(Dialog);
  private confirm = inject(ConfirmationService);
  private destroyRef = inject(DestroyRef);
  private translate = inject(TranslateService);

  public schools = this.auth.schools;
  public selected = this.auth.schoolId;

  public setSchool(id: string): void {
    patchState(this.auth, { schoolId: id });
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
        color: 'tertiary',
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
