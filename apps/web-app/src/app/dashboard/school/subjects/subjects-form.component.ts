import { AfterViewInit, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from '@skooltrak/models';
import { v4 } from 'uuid';

import { SchoolSubjectsStore } from './subjects.store';

@Component({
    selector: 'sk-school-subjects-form',
    imports: [
        MatDialogModule,
        MatButtonModule,
        ReactiveFormsModule,
        TranslateModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBar,
    ],
    providers: [],
    template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    @if (store.loading()) {
      <mat-progress-bar mode="indeterminate" />
    }
    <h2 mat-dialog-title>
      {{ 'SUBJECTS.DETAILS' | translate }}
    </h2>

    <mat-dialog-content>
      <mat-form-field>
        <mat-label for="name">{{ 'NAME' | translate }}</mat-label>
        <input type="text" formControlName="name" matInput />
      </mat-form-field>
      <mat-form-field>
        <mat-label for="short_name">{{ 'SHORT_NAME' | translate }}</mat-label>
        <input type="text" formControlName="short_name" matInput />
      </mat-form-field>
      <mat-form-field>
        <mat-label for="code">{{ 'CODE' | translate }}</mat-label>
        <input type="text" formControlName="code" matInput />
      </mat-form-field>
      <mat-form-field>
        <mat-label for="description">{{ 'DESCRIPTION' | translate }}</mat-label>
        <textarea rows="3" formControlName="description" matInput></textarea>
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
  </form>`
})
export class SubjectsFormComponent implements AfterViewInit {
  private data: Subject | undefined = inject(MAT_DIALOG_DATA);
  public store = inject(SchoolSubjectsStore);

  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    short_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(15)],
    }),
    code: new FormControl<string>('', {
      nonNullable: true,
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
    }),
  });

  public ngAfterViewInit(): void {
    !!this.data && this.form.patchValue(this.data);
  }

  public saveChanges(): void {
    this.store.saveSubject(this.form.getRawValue());
  }
}
