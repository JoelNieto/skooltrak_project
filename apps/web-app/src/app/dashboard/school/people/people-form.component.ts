import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  Component,
  DestroyRef,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { RoleEnum, SchoolProfile, StatusEnum } from '@skooltrak/models';
import { CardComponent } from '@skooltrak/ui';
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
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
  ],
  providers: [provideIcons({ heroXMark }), SchoolPeopleFormStore],
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
    <form [formGroup]="form" class="flex flex-col space-y-1">
      <div class="flex flex-col items-center justify-center gap-1">
        <sk-avatar
          [fileName]="data.user.avatar_url ?? 'default_avatar.jpg'"
          class="h-16"
          [rounded]="true"
        />
        <p class="font-sans font-semibold text-gray-600">
          {{ data.user.first_name }} {{ data.user.father_name }} /
          {{ data.user.document_id }}
        </p>
        <p class="font-mono text-sm text-sky-800">{{ data.user.email }}</p>
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
      @if (IS_STUDENT()) {
        <mat-form-field>
          <mat-label for="group">{{ 'GROUPS.NAME' | translate }}</mat-label>
          <mat-select [formControl]="groupControl">
            @for (group of store.groups(); track group.id) {
              <mat-option [value]="group.id">{{ group.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
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
      const group = this.store.currentGroupId();
      if (!group) return;

      this.groupControl.disable();
      this.groupControl.setValue(group, { emitEvent: false, onlySelf: true });
      this.groupControl.enable();
    });
  }

  public ngOnInit(): void {
    const { status, role, user_id } = this.data;
    patchState(this.store, { userId: user_id });
    this.form.patchValue({ status, role });
    if (role === 'STUDENT') {
      this.store.fetchGroups();
      this.store.fetchStudentGroup();
      this.IS_STUDENT.set(true);
    }
    this.groupControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroy), distinctUntilChanged())
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
