import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Period } from '@skooltrak/models';
import { format } from 'date-fns';

@Component({
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIcon,
  ],
  providers: [],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          {{ 'PERIODS.DETAILS' | translate }}
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
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
            <input
              formControlName="start_at"
              matInput
              [matDatepicker]="start"
            />
            <mat-datepicker-toggle matIconSuffix [for]="start" />
            <mat-datepicker #start />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="end_at">{{
              'PERIODS.END_AT' | translate
            }}</mat-label>
            <input formControlName="end_at" matInput [matDatepicker]="end" />
            <mat-datepicker-toggle matIconSuffix [for]="end" />
            <mat-datepicker #end />
          </mat-form-field>
        </div>
      </mat-card-content>
      <mat-card-footer>
        <mat-card-actions align="end">
          <button mat-stroked-button (click)="dialogRef.close()">
            <mat-icon>close</mat-icon>
            {{ 'CONFIRMATION.CANCEL' | translate }}
          </button>
          <button mat-flat-button [disabled]="form.invalid" type="submit">
            {{ 'SAVE_CHANGES' | translate }}
          </button>
        </mat-card-actions>
      </mat-card-footer>
    </mat-card>
  </form> `,
})
export class SchoolPeriodsFormComponent implements OnInit {
  public dialogRef = inject(DialogRef<Partial<Period>>);

  public data: Period | undefined = inject(DIALOG_DATA);

  public form = new FormGroup({
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
    this.dialogRef.close(this.form.getRawValue());
  }
}
