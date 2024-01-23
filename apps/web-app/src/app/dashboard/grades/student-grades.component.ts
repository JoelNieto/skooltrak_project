import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from '@skooltrak/ui';

import { StudentGradesStore } from './student-grades.store';

@Component({
  standalone: true,
  selector: 'sk-student-grades',
  imports: [SelectComponent, ReactiveFormsModule],
  providers: [StudentGradesStore],
  template: `<div class="mb-4 mt-2 flex justify-between">
    <div class="w-64">
      <sk-select
        [formControl]="periodControl"
        [items]="store.periods()"
        label="name"
        [search]="false"
      />
    </div>
  </div> `,
})
export class StudentGradesComponent {
  public store = inject(StudentGradesStore);
  public periodControl = new FormControl<string | undefined>(undefined);
}
