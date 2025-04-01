import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

import { StudentGradesStore } from './student-grades.store';

@Component({
    selector: 'sk-student-grades',
    imports: [
        MatSelectModule,
        MatFormFieldModule,
        TranslateModule,
        ReactiveFormsModule,
    ],
    providers: [StudentGradesStore],
    template: `<div class="mb-4 mt-2 flex justify-between">
    <mat-form-field class="w-64">
      <mat-label>{{ 'PERIODS.TITLE' | translate }}</mat-label>
      <mat-select [formControl]="periodControl">
        @for (period of store.periods(); track period.id) {
          <mat-option [value]="period.id">{{ period.name }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  </div> `
})
export class StudentGradesComponent {
  public store = inject(StudentGradesStore);
  public periodControl = new FormControl<string | undefined>(undefined);
}
