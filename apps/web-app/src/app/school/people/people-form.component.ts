import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgFor } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { CardComponent, InputDirective, LabelDirective } from '@skooltrak/ui';

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
    InputDirective,
    LabelDirective,
  ],
  providers: [
    provideIcons({ heroXMark }),
    provideComponentStore(SchoolPeopleStore),
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
        <label for="role" skLabel>{{ 'PEOPLE.ROLE' | translate }}</label>
        <select formControlName="role" skInput>
          <option *ngFor="let role of roles" [value]="role">
            {{ 'PEOPLE.' + role | translate }}
          </option>
        </select>
      </div>
      <div>
        <label for="status" skLabel>{{ 'PEOPLE.STATUS' | translate }}</label>
        <select formControlName="status" skInput>
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
  });

  public ngOnInit(): void {
    this.form.patchValue(this.data);
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: ({ status, role }) =>
        this.store.savePerson({ status, role, user_id: this.data.user_id }),
    });
  }
}
