import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { RoleEnum, SchoolProfile, StatusEnum } from '@skooltrak/models';
import { CardComponent } from '@skooltrak/ui';

import { AvatarComponent } from '../../components/avatar/avatar.component';
import { SchoolPeopleStore } from './people.store';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    NgIconComponent,
    ReactiveFormsModule,
    NgFor,
    AvatarComponent,
  ],
  providers: [
    provideIcons({ heroXMark }),
    provideComponentStore(SchoolPeopleStore),
  ],
  styles: [
    `
      input,
      select,
      textarea {
        @apply block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm;
        &.ng-invalid.ng-dirty {
          @apply border-red-400 bg-red-100 text-red-800 focus:border-red-600 focus:ring-red-600;
        }
      }

      label {
        @apply mb-2 block font-sans text-sm font-medium text-gray-600 dark:text-white;
      }
    `,
  ],
  template: `<sk-card
    ><div class="flex items-start justify-between" header>
      <h3
        class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'PEOPLE.EDIT' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <ng-icon
          name="heroXMark"
          size="24"
          class="text-gray-700 dark:text-gray-100"
        />
      </button>
    </div>
    <form [formGroup]="form" class="flex flex-col space-y-3">
      <div class="flex flex-col items-center justify-center gap-1">
        <sk-avatar
          [avatarUrl]="data.user.avatar_url ?? 'default_avatar.jpg'"
          class="h-16"
          [rounded]="true"
        />
        <p class="font-sans font-semibold text-gray-600">
          {{ data.user.first_name }} {{ data.user.father_name }} /
          {{ data.user.document_id }}
        </p>
        <p class="font-mono text-sm text-sky-800">{{ data.user.email }}</p>
      </div>
      <div>
        <label for="role">{{ 'PEOPLE.ROLE' | translate }}</label>
        <select formControlName="role">
          <option *ngFor="let role of roles" [value]="role">
            {{ 'PEOPLE.' + role | translate }}
          </option>
        </select>
      </div>
      <div>
        <label for="status">{{ 'PEOPLE.STATUS' | translate }}</label>
        <select formControlName="status">
          <option *ngFor="let status of statuses" [value]="status">
            {{ 'PEOPLE.' + status | translate }}
          </option>
        </select>
      </div>
    </form>
  </sk-card> `,
})
export class SchoolPeopleFormComponent implements OnInit {
  private store = inject(SchoolPeopleStore);
  public dialogRef = inject(DialogRef);
  public data: SchoolProfile = inject(DIALOG_DATA);

  public roles = Object.values(RoleEnum);
  public statuses = Object.values(StatusEnum);

  public form = new FormGroup({
    status: new FormControl<StatusEnum | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    role: new FormControl<RoleEnum | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public ngOnInit(): void {
    this.form.patchValue(this.data);
    this.form.valueChanges.subscribe({
      next: ({ status, role }) =>
        this.store.savePerson({ status, role, user_id: this.data.user_id }),
    });
  }
}
