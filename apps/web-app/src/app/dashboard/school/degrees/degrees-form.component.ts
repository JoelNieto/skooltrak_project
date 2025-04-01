import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Degree } from '@skooltrak/models';
import { v4 } from 'uuid';

import { SchoolDegreesStore } from './degrees.store';

@Component({
    selector: 'sk-degrees-form',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        TranslateModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIcon,
        MatProgressBar,
    ],
    template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    @if (store.loading()) {
      <mat-progress-bar mode="indeterminate" />
    }

    <h2 mat-dialog-title>
      {{ 'DEGREES.DETAILS' | translate }}
    </h2>
    <mat-dialog-content>
      <div class="flex flex-col space-y-1">
        <mat-form-field>
          <mat-label>{{ 'NAME' | translate }}</mat-label>
          <input type="text" formControlName="name" matInput />
        </mat-form-field>
        <mat-form-field>
          <mat-label>{{ 'LEVEL' | translate }}</mat-label>
          <mat-select formControlName="level_id">
            @for (level of store.levels(); track level.id) {
              <mat-option [value]="level.id"> {{ level.name }}</mat-option>
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
export class DegreesFormComponent implements OnInit {
  private data: Degree | undefined = inject(MAT_DIALOG_DATA);
  public store = inject(SchoolDegreesStore);

  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    level_id: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public ngOnInit(): void {
    !!this.data && this.form.patchValue(this.data);
    this.store.fetchLevels();
  }

  public saveChanges(): void {
    this.store.saveDegree(this.form.getRawValue());
  }
}
