import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { Period } from '@skooltrak/models';
import { ButtonDirective, CardComponent, LabelDirective } from '@skooltrak/ui';
import { format } from 'date-fns';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    ReactiveFormsModule,
    NgIconComponent,
    TranslateModule,
    ButtonDirective,
    LabelDirective,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  providers: [provideIcons({ heroXMark })],
  template: `<sk-card>
    <div class="mb-3 flex items-start justify-between" header>
      <h3
        class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'PERIODS.DETAILS' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <ng-icon
          name="heroXMark"
          class="text-gray-700 dark:text-gray-100"
          size="24"
        />
      </button>
    </div>
    <form
      [formGroup]="form"
      (ngSubmit)="saveChanges()"
      class="flex flex-col space-y-3"
    >
      <mat-form-field>
        <mat-label for="name">{{ 'Name' | translate }}</mat-label>
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
      <div class="flex justify-end">
        <button skButton color="sky" type="submit">
          {{ 'Save changes' | translate }}
        </button>
      </div>
    </form>
  </sk-card>`,
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
