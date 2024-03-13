import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { ClassGroup } from '@skooltrak/models';
import { CardComponent, SelectComponent } from '@skooltrak/ui';

import { GroupsFormStore } from './groups-form.store';

@Component({
  selector: 'sk-groups-form',
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    ReactiveFormsModule,
    SelectComponent,
    MatButton,
    MatFormField,
    MatSelect,
    MatInput,
    MatLabel,
    MatOption,
    MatIcon,
    MatIconButton,
  ],
  providers: [GroupsFormStore],

  template: `<sk-card>
    <div class="flex items-center justify-between" header>
      <h3
        class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'GROUPS.DETAILS' | translate }}
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
        <mat-label for="name">{{ 'Name' | translate }}</mat-label>
        <input type="text" formControlName="name" matInput />
      </mat-form-field>
      <mat-form-field>
        <mat-label for="degree_id">{{ 'Degree' | translate }}</mat-label>
        <mat-select formControlName="degree_id">
          @for (degree of store.degrees(); track degree.id) {
            <mat-option [value]="degree.id">{{ degree.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label for="plan_id">{{ 'Plan' | translate }}</mat-label>
        <mat-select formControlName="plan_id">
          @for (plan of store.plans(); track plan.id) {
            <mat-option [value]="plan.id">{{ plan.name }}</mat-option>
          }
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
export class SchoolGroupsFormComponent implements OnInit {
  public dialogRef = inject(DialogRef<Partial<ClassGroup>>);
  private data: ClassGroup | undefined = inject(DIALOG_DATA);
  public store = inject(GroupsFormStore);
  private destroyRef = inject(DestroyRef);

  public form = new FormGroup({
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
    this.dialogRef.close(this.form.getRawValue());
  }
}
