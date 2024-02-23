import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { StudyPlan } from '@skooltrak/models';
import { ButtonDirective, CardComponent, SelectComponent } from '@skooltrak/ui';
import { filter } from 'rxjs';

import { PlansFormStore } from './plans-form.store';

@Component({
  selector: 'sk-admin-plans-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    SelectComponent,
    ButtonDirective,
    MatFormField,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatButton,
    MatIconButton,
    MatIcon,
  ],
  providers: [PlansFormStore],
  template: `<sk-card>
    <div class="flex items-baseline justify-between" header>
      <h3
        class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'PLANS.DETAILS' | translate }}
      </h3>
      <button mat-icon-button (click)="dialogRef.close()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <form
      [formGroup]="form"
      class="flex flex-col space-y-1"
      (ngSubmit)="saveChanges()"
    >
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
      <div class="flex justify-end">
        <button
          mat-flat-button
          color="accent"
          type="submit"
          [disabled]="form.invalid"
        >
          {{ 'SAVE_CHANGES' | translate }}
        </button>
      </div>
    </form>
  </sk-card>`,
})
export class StudyPlansFormComponent implements OnInit {
  public dialogRef = inject(DialogRef<Partial<StudyPlan>>);
  private data: StudyPlan | undefined = inject(DIALOG_DATA);
  public store = inject(PlansFormStore);
  private destroy = inject(DestroyRef);
  public form = new FormGroup({
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
    this.dialogRef.close(this.form.getRawValue());
  }
}
