import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { RoleEnum, StatusEnum, UserProfile } from '@skooltrak/models';
import { CardComponent } from '@skooltrak/ui';

import { AvatarComponent } from '../../../components/avatar/avatar.component';
import { SchoolPeopleFormStore } from './people-form.store';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    ReactiveFormsModule,
    AvatarComponent,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatIconButton,
    MatIcon,
    MatButton,
  ],
  providers: [SchoolPeopleFormStore],
  template: `<sk-card
    ><div class="flex items-center justify-between" header>
      <h3
        class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'PEOPLE.EDIT' | translate }}
      </h3>
      <button mat-icon-button (click)="dialogRef.close()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <form
      [formGroup]="form"
      class="flex flex-col space-y-1"
      (ngSubmit)="savePerson()"
    >
      <div class="flex flex-col items-center justify-center gap-1">
        <sk-avatar
          [fileName]="data.user?.avatar_url ?? 'default_avatar.jpg'"
          class="h-20"
          [rounded]="true"
        />
        <p class="font-sans font-semibold text-gray-600">
          {{ data.user?.first_name }} {{ data.user?.father_name }} /
          {{ data.user?.document_id }}
        </p>
        <p class="font-mono text-sm text-sky-800 mb-2">
          {{ data.user?.email }}
        </p>
      </div>
      <mat-form-field>
        <mat-label for="role">{{ 'PEOPLE.ROLE' | translate }}</mat-label>
        <mat-select formControlName="role">
          @for (role of roles; track role) {
            <mat-option [value]="role">
              {{ 'PEOPLE.' + role | translate }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label for="status">{{ 'PEOPLE.STATUS' | translate }}</mat-label>
        <mat-select formControlName="status">
          @for (status of statuses; track status) {
            <mat-option [value]="status">
              {{ 'PEOPLE.' + status | translate }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
      @if (isStudent()) {
        <mat-form-field>
          <mat-label for="group">{{ 'GROUPS.NAME' | translate }}</mat-label>
          <mat-select formControlName="group_id">
            @for (group of store.groups(); track group.id) {
              <mat-option [value]="group.id">{{ group.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      }
      <div class="flex justify-end">
        <button mat-flat-button color="accent" type="submit">
          {{ 'SAVE_CHANGES' | translate }}
        </button>
      </div>
    </form>
  </sk-card> `,
})
export class SchoolPeopleFormComponent implements OnInit {
  public store = inject(SchoolPeopleFormStore);
  public dialogRef = inject(DialogRef);
  public data: UserProfile = inject(DIALOG_DATA);
  public isStudent = signal(false);
  public roles = Object.values(RoleEnum);
  public statuses = Object.values(StatusEnum);
  private destroy = inject(DestroyRef);

  public form = new FormGroup({
    status: new FormControl<StatusEnum | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    role: new FormControl<RoleEnum | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    group_id: new FormControl<string | undefined>('', { nonNullable: true }),
  });

  public ngOnInit(): void {
    const { status, role, group_id, user_id } = this.data;
    patchState(this.store, { userId: user_id });
    this.form.patchValue({ status, role, group_id });
    this.store.fetchGroups();

    if (role === 'STUDENT') {
      this.isStudent.set(true);
    }

    this.form
      .get('role')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (role) => {
          if (role === 'STUDENT') {
            this.isStudent.set(true);
          }
        },
      });
  }

  public savePerson(): void {
    this.store.savePerson(this.form.getRawValue());
  }
}
