import { AfterViewInit, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from '@skooltrak/models';

@Component({
  selector: 'sk-school-subjects-form',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButton,
    ReactiveFormsModule,
    TranslateModule,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatIcon,
    MatInput,
  ],
  providers: [],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
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
      <button mat-stroked-button mat-dialog-close="">
        <mat-icon>close</mat-icon>
        {{ 'CONFIRMATION.CANCEL' | translate }}
      </button>
      <button mat-flat-button type="submit" [disabled]="form.invalid">
        {{ 'SAVE_CHANGES' | translate }}
      </button>
    </mat-dialog-actions>
  </form>`,
})
export class SubjectsFormComponent implements AfterViewInit {
  public dialogRef = inject(MatDialogRef<Partial<Subject>>);
  private data: Subject | undefined = inject(MAT_DIALOG_DATA);
  public form = new FormGroup({
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
    this.dialogRef.close(this.form.getRawValue());
  }
}
