import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AfterViewInit, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from '@skooltrak/models';

@Component({
  selector: 'sk-school-subjects-form',
  standalone: true,
  imports: [
    MatCardModule,
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
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          {{ 'SUBJECTS.DETAILS' | translate }}
        </mat-card-title>
      </mat-card-header>
      <mat-card-content
        ><div class="flex flex-col space-y-1">
          <mat-form-field>
            <mat-label for="name">{{ 'NAME' | translate }}</mat-label>
            <input type="text" formControlName="name" matInput />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="short_name">{{
              'SHORT_NAME' | translate
            }}</mat-label>
            <input type="text" formControlName="short_name" matInput />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="code">{{ 'CODE' | translate }}</mat-label>
            <input type="text" formControlName="code" matInput />
          </mat-form-field>
          <mat-form-field>
            <mat-label for="description">{{
              'DESCRIPTION' | translate
            }}</mat-label>
            <textarea
              rows="3"
              formControlName="description"
              matInput
            ></textarea>
          </mat-form-field>
        </div>
      </mat-card-content>
      <mat-card-footer>
        <mat-card-actions align="end">
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
        </mat-card-actions>
      </mat-card-footer>
    </mat-card>
  </form>`,
})
export class SubjectsFormComponent implements AfterViewInit {
  public dialogRef = inject(DialogRef<Partial<Subject>>);
  private data: Subject | undefined = inject(DIALOG_DATA);
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
