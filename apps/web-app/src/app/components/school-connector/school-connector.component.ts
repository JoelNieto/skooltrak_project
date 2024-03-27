import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { RoleEnum } from '@skooltrak/models';
import { ConfirmationService } from '@skooltrak/ui';

import { SchoolConnectorStore } from './school-connector.store';

@Component({
  standalone: true,
  selector: 'sk-school-connector',
  imports: [
    MatCardModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  providers: [SchoolConnectorStore, ConfirmationService],
  styles: `

  `,
  template: `<form [formGroup]="form" (ngSubmit)="validateCode()">
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          {{ 'SCHOOL_CONNECTOR.CONNECT' | translate }}
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p class="mat-caption mb-2">
          {{ 'School Connector.Message' | translate }}
        </p>
        <div class="grid grid-cols-2 gap-4">
          <mat-form-field>
            <mat-label for="code">{{ 'CODE' | translate }}</mat-label>
            <input type="text" formControlName="code" matInput />
            @if (form.get('code')?.hasError('minlength')) {
              <mat-hint class="font-sans text-xs text-red-500">{{
                'Errors.minLength' | translate: { length: 10 }
              }}</mat-hint>
            }
          </mat-form-field>
          <mat-form-field>
            <mat-label for="role">{{ 'ROLE' | translate }}</mat-label>
            <mat-select formControlName="role">
              @for (role of roles; track role) {
                <mat-option [value]="role">
                  {{ role | translate }}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card-content>
      <mat-card-footer>
        <mat-card-actions align="end">
          <button mat-stroked-button (click)="dialogRef.close()">
            <mat-icon>close</mat-icon>
            {{ 'CONFIRMATION.CANCEL' | translate }}
          </button>
          <button mat-flat-button type="submit" [disabled]="!form.valid">
            <mat-icon>add</mat-icon> {{ 'ACTIONS.ADD' | translate }}
          </button>
        </mat-card-actions>
      </mat-card-footer>
    </mat-card>
  </form>`,
})
export class SchoolConnectorComponent {
  public dialogRef = inject(DialogRef);
  public roles = Object.values(RoleEnum);
  private store = inject(SchoolConnectorStore);
  private numberRegEx = /^\d+$/;

  public form = new FormGroup({
    code: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(this.numberRegEx),
      ],
      updateOn: 'blur',
    }),
    role: new FormControl<RoleEnum | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public validateCode(): void {
    const { code, role } = this.form.getRawValue();
    patchState(this.store, { role });
    this.store.fetchSchoolByCode(code);
  }
}
