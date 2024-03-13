import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AfterViewInit, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from '@skooltrak/models';
import { CardComponent } from '@skooltrak/ui';

@Component({
  selector: 'sk-school-subjects-form',
  standalone: true,
  imports: [
    CardComponent,
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
  template: `<sk-card>
    <div class="flex items-baseline justify-between" header>
      <h3
        class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'SUBJECTS.DETAILS' | translate }}
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
