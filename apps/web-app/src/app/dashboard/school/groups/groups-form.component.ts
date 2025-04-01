import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { ClassGroup } from '@skooltrak/models';
import { v4 } from 'uuid';

import { SchoolGroupsStore } from './groups.store';

@Component({
    selector: 'sk-groups-form',
    imports: [
        MatDialogModule,
        TranslateModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatProgressBar,
        MatIcon,
    ],
    template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    @if (store.loading()) {
      <mat-progress-bar mode="indeterminate" />
    }
    <h2 mat-dialog-title>
      {{ 'GROUPS.DETAILS' | translate }}
    </h2>
    <mat-dialog-content>
      <div class="flex flex-col space-y-1">
        <mat-form-field>
          <mat-label>{{ 'NAME' | translate }}</mat-label>
          <input type="text" formControlName="name" matInput />
        </mat-form-field>
        <mat-form-field>
          <mat-label>{{ 'DEGREES.ITEM' | translate }}</mat-label>
          <mat-select formControlName="degree_id">
            @for (degree of store.degrees(); track degree.id) {
              <mat-option [value]="degree.id">{{ degree.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>{{ 'PLANS.NAME' | translate }}</mat-label>
          <mat-select formControlName="plan_id">
            @for (plan of store.plans(); track plan.id) {
              <mat-option [value]="plan.id">{{ plan.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close>
        <mat-icon>close</mat-icon>
        {{ 'CONFIRMATION.CANCEL' | translate }}
      </button>
      <button mat-flat-button type="submit" [disabled]="form.invalid">
        {{ 'SAVE_CHANGES' | translate }}
      </button>
    </mat-dialog-actions>
  </form> `
})
export class SchoolGroupsFormComponent implements OnInit {
  private data: ClassGroup | undefined = inject(MAT_DIALOG_DATA);
  public store = inject(SchoolGroupsStore);
  private destroyRef = inject(DestroyRef);

  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    plan_id: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    degree_id: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public ngOnInit(): void {
    this.store.fetchDegrees()
    if (this.data) {
      this.form.patchValue(this.data);
      patchState(this.store, { degreeId: this.data?.degree_id });
    }

    this.form
      .get('degree_id')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (degreeId) => patchState(this.store, { degreeId }),
      });
  }

  public saveChanges(): void {
    this.store.saveGroup(this.form.getRawValue());
  }
}
