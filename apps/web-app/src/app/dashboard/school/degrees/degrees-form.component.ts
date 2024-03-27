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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Degree } from '@skooltrak/models';

import { DegreesFormStore } from './degrees-form.store';

@Component({
  selector: 'sk-degrees-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    TranslateModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIcon,
  ],
  providers: [DegreesFormStore],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          {{ 'DEGREES.DETAILS' | translate }}
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="flex flex-col space-y-1">
          <mat-form-field>
            <mat-label for="name">{{ 'NAME' | translate }}</mat-label>
            <input type="text" formControlName="name" matInput />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="level_id">{{ 'LEVEL' | translate }}</mat-label>
            <mat-select formControlName="level_id">
              @for (level of store.levels(); track level.id) {
                <mat-option [value]="level.id"> {{ level.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card-content>
      <mat-card-footer
        ><mat-card-actions align="end">
          <button mat-stroked-button (click)="dialogRef.close()">
            <mat-icon>close</mat-icon>
            {{ 'CONFIRMATION.CANCEL' | translate }}
          </button>
          <button
            mat-flat-button
            color="accent"
            type="submit"
            [disabled]="form.invalid"
          >
            {{ 'SAVE_CHANGES' | translate }}
          </button>
        </mat-card-actions></mat-card-footer
      >
    </mat-card>
  </form> `,
})
export class DegreesFormComponent implements OnInit {
  public dialogRef = inject(DialogRef<Partial<Degree>>);
  private data: Degree | undefined = inject(DIALOG_DATA);
  public store = inject(DegreesFormStore);

  public form = new FormGroup({
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
  }

  public saveChanges(): void {
    this.dialogRef.close(this.form.getRawValue());
  }
}
