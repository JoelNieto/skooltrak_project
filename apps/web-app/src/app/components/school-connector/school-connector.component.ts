import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { RoleEnum } from '@skooltrak/models';
import { CardComponent, ConfirmationService } from '@skooltrak/ui';

import { SchoolConnectorStore } from './school-connector.store';

@Component({
  standalone: true,
  selector: 'sk-school-connector',
  imports: [
    CardComponent,
    MatIcon,
    TranslateModule,
    MatButton,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatLabel,
    MatHint,
    MatSelect,
    MatOption,
  ],
  providers: [SchoolConnectorStore, ConfirmationService],
  styles: `

  `,
  template: `<sk-card>
    <div class="flex items-center justify-between" header>
      <h3
        class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'SCHOOL_CONNECTOR.CONNECT' | translate }}
      </h3>
      <button mat-icon-button (click)="dialogRef.close()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <form [formGroup]="form" (ngSubmit)="validateCode()">
      <p class="mb-2 text-sm italic text-gray-500">
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
      <div class="mt-4 flex justify-end">
        <button
          mat-flat-button
          color="accent"
          type="submit"
          [disabled]="!form.valid"
        >
          <mat-icon>add_circle</mat-icon>
          <span>{{ 'ACTIONS.ADD' | translate }}</span>
        </button>
      </div>
    </form>
  </sk-card>`,
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
