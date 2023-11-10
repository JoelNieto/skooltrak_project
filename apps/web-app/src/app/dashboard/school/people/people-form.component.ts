import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { RoleEnum, SchoolProfile, StatusEnum } from '@skooltrak/models';
import { CardComponent, InputDirective, LabelDirective, SelectComponent } from '@skooltrak/ui';
import { distinctUntilChanged } from 'rxjs';

import { AvatarComponent } from '../../../components/avatar/avatar.component';
import { SchoolPeopleFormStore } from './people-form.store';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    NgIconComponent,
    ReactiveFormsModule,
    AvatarComponent,
    InputDirective,
    LabelDirective,
    SelectComponent,
  ],
  providers: [
    provideIcons({ heroXMark }),
    provideComponentStore(SchoolPeopleFormStore),
  ],
  template: `<sk-card
    ><div class="flex items-start justify-between" header>
      <h3
        class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
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
          @for(role of roles; track role) {
          <option [value]="role">
            {{ 'PEOPLE.' + role | translate }}
          </option>
          }
        </select>
      </div>
      <div>
        <label for="status" skLabel>{{ 'PEOPLE.STATUS' | translate }}</label>
        <select formControlName="status" skInput>
          @for(status of statuses; track status) {
          <option [value]="status">
            {{ 'PEOPLE.' + status | translate }}
          </option>
          }
        </select>
      </div>
      @if(IS_STUDENT()) {
      <div>
        <label for="group" skLabel>{{ 'GROUPS.NAME' | translate }}</label>
        <sk-select
          label="name"
          [formControl]="groupControl"
          [items]="store.GROUPS()"
        />
      </div>
      }
    </form>
  </sk-card> `,
})
export class SchoolPeopleFormComponent implements OnInit {
  public store = inject(SchoolPeopleFormStore);
  public dialogRef = inject(DialogRef);
  public data: SchoolProfile = inject(DIALOG_DATA);
  public IS_STUDENT = signal(false);
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

  public groupControl = new FormControl<string | undefined>(undefined, {
    nonNullable: true,
  });

  constructor() {
    effect(() => {
      const group = this.store.GROUP_ID();
      if (!group) return;

      this.groupControl.disable();
      this.groupControl.setValue(group, { emitEvent: false, onlySelf: true });
      this.groupControl.enable();
    });
  }

  public ngOnInit(): void {
    const { status, role, user_id } = this.data;
    this.store.patchState({ USER_ID: user_id });
    this.form.patchValue({ status, role });
    if (role === 'STUDENT') {
      this.store.fetchGroups();
      this.store.fetchStudentGroup();
      this.IS_STUDENT.set(true);
    }
    this.groupControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (val) => {
          !!val && this.store.saveGroup(val);
        },
      });
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: ({ status, role }) => {
        this.store.savePerson({ status, role, user_id });
        if (role === 'STUDENT') {
          this.store.fetchGroups();
        }
      },
    });
  }
}
