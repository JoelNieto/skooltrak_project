import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { Period } from '@skooltrak/models';
import { format } from 'date-fns';
import { v4 } from 'uuid';

import { SchoolPeriodsStore } from './periods.store';

@Component({
    imports: [
        MatDialogModule,
        ReactiveFormsModule,
        TranslateModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatIcon,
        MatProgressBar,
    ],
    providers: [],
    template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    @if (store.loading()) {
      <mat-progress-bar mode="indeterminate" />
    }
    <h2 mat-dialog-title>
      {{ 'PERIODS.DETAILS' | translate }}
    </h2>
    <mat-dialog-content>
      <div class="flex flex-col space-y-3">
        <mat-form-field>
          <mat-label for="name">{{ 'NAME' | translate }}</mat-label>
          <input type="text" formControlName="name" matInput />
        </mat-form-field>
        <mat-form-field>
          <mat-label for="year">{{ 'PERIODS.YEAR' | translate }}</mat-label>
          <input type="number" formControlName="year" matInput />
        </mat-form-field>
        <mat-form-field>
          <mat-label for="start_at">{{
            'PERIODS.START_AT' | translate
          }}</mat-label>
          <input formControlName="start_at" matInput [matDatepicker]="start" />
          <mat-datepicker-toggle matIconSuffix [for]="start" />
          <mat-datepicker #start />
        </mat-form-field>
        <mat-form-field>
          <mat-label for="end_at">{{ 'PERIODS.END_AT' | translate }}</mat-label>
          <input formControlName="end_at" matInput [matDatepicker]="end" />
          <mat-datepicker-toggle matIconSuffix [for]="end" />
          <mat-datepicker #end />
        </mat-form-field>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close>
        <mat-icon>close</mat-icon>
        {{ 'CONFIRMATION.CANCEL' | translate }}
      </button>
      <button mat-flat-button [disabled]="form.invalid" type="submit">
        {{ 'SAVE_CHANGES' | translate }}
      </button>
    </mat-dialog-actions>
  </form> `
})
export class SchoolPeriodsFormComponent implements OnInit {
  public data: Period | undefined = inject(MAT_DIALOG_DATA);
  public store = inject(SchoolPeriodsStore);

  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    year: new FormControl(new Date().getUTCFullYear(), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    start_at: new FormControl(format(new Date(), 'yyyy-MM-dd'), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    end_at: new FormControl(format(new Date(), 'yyyy-MM-dd'), {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  public ngOnInit(): void {
    !!this.data && this.form.patchValue(this.data);
  }

  public saveChanges(): void {
    this.store.savePeriod(this.form.getRawValue());
  }
}
