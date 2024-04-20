import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { StudyPlan } from '@skooltrak/models';
import { filter } from 'rxjs';
import { v4 } from 'uuid';

import { SchoolPlansStore } from './plans.store';

@Component({
  selector: 'sk-admin-plans-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBar,
    MatIcon,
  ],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    @if (store.loading()) {
      <mat-progress-bar mode="indeterminate" />
    }
    <h2 mat-dialog-title>
      {{ 'PLANS.DETAILS' | translate }}
    </h2>

    <mat-dialog-content class="flex flex-col space-y-1">
      <mat-form-field>
        <mat-label for="name">{{ 'NAME' | translate }}</mat-label>
        <input type="text" formControlName="name" matInput />
      </mat-form-field>
      <mat-form-field>
        <mat-label for="degree_id">{{ 'PLANS.DEGREE' | translate }}</mat-label>
        <mat-select formControlName="degree_id">
          @for (degree of store.degrees(); track degree.id) {
            <mat-option [value]="degree.id">{{ degree.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label for="year">{{ 'PLANS.YEAR' | translate }}</mat-label>
        <mat-select label="name" formControlName="year">
          <mat-option [value]="-1">Pre-Kinder</mat-option>
          <mat-option [value]="0">Kinder</mat-option>
          <mat-option [value]="1">1</mat-option>
          <mat-option [value]="2">2</mat-option>
          <mat-option [value]="3">3</mat-option>
          <mat-option [value]="4">4</mat-option>
          <mat-option [value]="5">5</mat-option>
          <mat-option [value]="6">6</mat-option>
          <mat-option [value]="7">7</mat-option>
          <mat-option [value]="8">8</mat-option>
          <mat-option [value]="9">9</mat-option>
          <mat-option [value]="10">10</mat-option>
          <mat-option [value]="11">11</mat-option>
          <mat-option [value]="12">12</mat-option>
        </mat-select>
      </mat-form-field>
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
  </form>`,
})
export class StudyPlansFormComponent implements OnInit {
  public dialogRef = inject(DialogRef<Partial<StudyPlan>>);
  private data: StudyPlan | undefined = inject(DIALOG_DATA);
  public store = inject(SchoolPlansStore);
  private destroy = inject(DestroyRef);
  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    level_id: new FormControl<string>('', {
      nonNullable: true,
    }),
    degree_id: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    year: new FormControl<number | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public ngOnInit(): void {
    this.store.fetchDegrees();
    this.form
      .get('degree_id')
      ?.valueChanges.pipe(
        takeUntilDestroyed(this.destroy),
        filter((val) => !!val),
      )
      .subscribe({
        next: (id) => {
          const value = this.store.degrees().find((x) => x.id === id);
          !!value && this.form.get('level_id')?.setValue(value.level_id);
        },
      });
    !!this.data && this.form.patchValue(this.data);
  }

  public saveChanges(): void {
    this.store.savePlan(this.form.getRawValue());
  }
}
